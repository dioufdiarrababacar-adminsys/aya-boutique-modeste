import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createPendingOrder, type CheckoutCustomerInput, type CheckoutItemInput } from "@/lib/orders";
import { createPaydunyaInvoice } from "@/lib/payments/paydunya";

type CheckoutBody = {
  customer: CheckoutCustomerInput;
  items: CheckoutItemInput[];
};

export async function POST(request: NextRequest) {
  let body: CheckoutBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps de requete invalide" }, { status: 400 });
  }

  const { customer, items } = body;
  if (!customer?.name || !customer?.phone || !customer?.address || !customer?.city) {
    return NextResponse.json({ error: "Informations de livraison incompletes" }, { status: 400 });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Le panier est vide" }, { status: 400 });
  }

  let order;
  try {
    order = await createPendingOrder(customer, items);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur inconnue";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  try {
    const invoice = await createPaydunyaInvoice({
      orderId: order.id,
      orderReference: order.reference,
      totalCfa: order.totalCfa,
      items: order.items.map((i) => ({
        name: i.productName,
        quantity: i.quantity,
        unitPriceCfa: i.unitPriceCfa,
      })),
      returnUrl: `${siteUrl}/commande/confirmation/${order.id}`,
      cancelUrl: `${siteUrl}/commande?annule=1`,
      callbackUrl: `${siteUrl}/api/webhooks/paydunya`,
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { paymentRef: invoice.token },
    });

    return NextResponse.json({ orderId: order.id, redirectUrl: invoice.checkoutUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur de paiement inconnue";
    return NextResponse.json({ orderId: order.id, error: message }, { status: 502 });
  }
}
