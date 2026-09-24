/**
 * Integration PayDunya (agregateur senegalais : Wave, Orange Money, Free
 * Money et carte bancaire Visa/Mastercard via une seule page de paiement
 * hebergee).
 *
 * Necessite un compte marchand PayDunya, cree sur https://paydunya.com puis
 * valide (piece d'identite + info business). Les cles se recuperent dans
 * Compte > Cles API sur le tableau de bord PayDunya.
 *
 * A verifier au moment du branchement reel : le nom exact des champs peut
 * evoluer, se referer a la documentation PayDunya a jour
 * (https://paydunya.com/developers) avant la mise en production.
 */

const PAYDUNYA_BASE_URL =
  process.env.PAYDUNYA_MODE === "live"
    ? "https://app.paydunya.com/api/v1"
    : "https://app.paydunya.com/sandbox-api/v1";

function getHeaders() {
  const masterKey = process.env.PAYDUNYA_MASTER_KEY;
  const privateKey = process.env.PAYDUNYA_PRIVATE_KEY;
  const token = process.env.PAYDUNYA_TOKEN;
  if (!masterKey || !privateKey || !token) {
    throw new Error(
      "PAYDUNYA_MASTER_KEY / PAYDUNYA_PRIVATE_KEY / PAYDUNYA_TOKEN manquants dans .env"
    );
  }
  return {
    "Content-Type": "application/json",
    "PAYDUNYA-MASTER-KEY": masterKey,
    "PAYDUNYA-PRIVATE-KEY": privateKey,
    "PAYDUNYA-TOKEN": token,
  };
}

export type PaydunyaInvoiceItem = {
  name: string;
  quantity: number;
  unitPriceCfa: number;
};

export async function createPaydunyaInvoice(params: {
  orderId: string;
  orderReference: string;
  totalCfa: number;
  items: PaydunyaInvoiceItem[];
  returnUrl: string;
  cancelUrl: string;
  callbackUrl: string;
}): Promise<{ token: string; checkoutUrl: string }> {
  const response = await fetch(`${PAYDUNYA_BASE_URL}/checkout-invoice/create`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      invoice: {
        total_amount: params.totalCfa,
        description: `Commande ${params.orderReference}`,
        items: params.items.reduce<Record<string, unknown>>((acc, item, index) => {
          acc[`item_${index}`] = {
            name: item.name,
            quantity: item.quantity,
            unit_price: item.unitPriceCfa,
            total_price: item.unitPriceCfa * item.quantity,
          };
          return acc;
        }, {}),
      },
      store: { name: "Aya" },
      actions: {
        cancel_url: params.cancelUrl,
        return_url: params.returnUrl,
        callback_url: params.callbackUrl,
      },
      custom_data: { order_id: params.orderId, order_reference: params.orderReference },
    }),
  });

  const data = (await response.json()) as {
    response_code: string;
    response_text: string;
    token?: string;
  };

  if (data.response_code !== "00" || !data.token) {
    throw new Error(`Echec creation facture PayDunya: ${data.response_text}`);
  }

  return { token: data.token, checkoutUrl: `https://paydunya.com/checkout/invoice/${data.token}` };
}

export type PaydunyaInvoiceStatus = {
  status: "completed" | "pending" | "cancelled";
  paymentMethod: string | null;
  customData: Record<string, string> | null;
};

export async function confirmPaydunyaInvoice(token: string): Promise<PaydunyaInvoiceStatus> {
  const response = await fetch(`${PAYDUNYA_BASE_URL}/checkout-invoice/confirm/${token}`, {
    headers: getHeaders(),
  });

  const data = (await response.json()) as {
    status: "completed" | "pending" | "cancelled";
    customer?: { payment_method?: string };
    custom_data?: Record<string, string>;
  };

  return {
    status: data.status,
    paymentMethod: data.customer?.payment_method ?? null,
    customData: data.custom_data ?? null,
  };
}

export function mapPaydunyaMethodToEnum(
  method: string | null
): "WAVE" | "ORANGE_MONEY" | "FREE_MONEY" | "CARD" | null {
  if (!method) return null;
  const normalized = method.toLowerCase();
  if (normalized.includes("wave")) return "WAVE";
  if (normalized.includes("orange")) return "ORANGE_MONEY";
  if (normalized.includes("free")) return "FREE_MONEY";
  if (normalized.includes("card") || normalized.includes("carte")) return "CARD";
  return null;
}
