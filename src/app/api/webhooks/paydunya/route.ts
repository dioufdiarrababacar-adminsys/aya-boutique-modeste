import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { confirmPaydunyaInvoice, mapPaydunyaMethodToEnum } from "@/lib/payments/paydunya";

/**
 * PayDunya envoie sa notification (IPN) sur cette URL des qu'un paiement est
 * tente. Par securite on ne fait jamais confiance au contenu recu : on
 * extrait uniquement le token de facture, puis on rappelle l'API PayDunya
 * (confirm) pour verifier le statut reel avant de mettre a jour la commande.
 */
async function extractToken(request: NextRequest): Promise<string | null> {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const body = await request.json().catch(() => null);
    return body?.token ?? body?.data?.invoice?.token ?? null;
  }

  const formData = await request.formData().catch(() => null);
  if (!formData) return null;

  const directToken = formData.get("token");
  if (typeof directToken === "string") return directToken;

  const rawData = formData.get("data");
  if (typeof rawData === "string") {
    try {
      const parsed = JSON.parse(rawData);
      return parsed?.invoice?.token ?? parsed?.token ?? null;
    } catch {
      return null;
    }
  }

  return null;
}

export async function POST(request: NextRequest) {
  const token = await extractToken(request);
  if (!token) {
    return NextResponse.json({ error: "Token de facture introuvable" }, { status: 400 });
  }

  const order = await prisma.order.findFirst({ where: { paymentRef: token } });
  if (!order) {
    return NextResponse.json({ error: "Commande introuvable pour ce token" }, { status: 404 });
  }

  const confirmation = await confirmPaydunyaInvoice(token);

  await prisma.order.update({
    where: { id: order.id },
    data: {
      paymentStatus: confirmation.status === "completed" ? "PAID" : confirmation.status === "cancelled" ? "FAILED" : "PENDING",
      paymentMethod: mapPaydunyaMethodToEnum(confirmation.paymentMethod) ?? order.paymentMethod,
    },
  });

  return NextResponse.json({ ok: true });
}
