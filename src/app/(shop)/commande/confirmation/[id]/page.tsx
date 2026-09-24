import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { confirmPaydunyaInvoice, mapPaydunyaMethodToEnum } from "@/lib/payments/paydunya";
import { formatCfa } from "@/lib/format";
import { ClearCartOnMount } from "@/components/clear-cart-on-mount";

export default async function OrderConfirmationPage({ params }: PageProps<"/commande/confirmation/[id]">) {
  const { id } = await params;

  let order = await prisma.order.findUnique({ where: { id } });
  if (!order) notFound();

  if (order.paymentStatus === "PENDING" && order.paymentRef) {
    try {
      const confirmation = await confirmPaydunyaInvoice(order.paymentRef);
      order = await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus:
            confirmation.status === "completed"
              ? "PAID"
              : confirmation.status === "cancelled"
                ? "FAILED"
                : "PENDING",
          paymentMethod: mapPaydunyaMethodToEnum(confirmation.paymentMethod) ?? order.paymentMethod,
        },
      });
    } catch {
      // La verification directe a echoue, le webhook PayDunya mettra la commande a jour.
    }
  }

  const isPaid = order.paymentStatus === "PAID";
  const isFailed = order.paymentStatus === "FAILED";

  return (
    <div className="mx-auto max-w-2xl px-6 py-24 flex flex-col items-center text-center gap-6">
      {isPaid && <ClearCartOnMount />}

      <h1 className="text-3xl">
        {isPaid ? "Merci pour votre commande !" : isFailed ? "Paiement non abouti" : "Paiement en cours de vérification"}
      </h1>

      <p className="text-charbon/70">
        Référence : <span className="text-charbon">{order.reference}</span>
      </p>

      {isPaid && (
        <p className="text-charbon/70 max-w-md">
          Votre commande de {formatCfa(order.totalCfa)} est confirmée. Vous recevrez un appel ou
          un message au {order.customerPhone} pour organiser la livraison.
        </p>
      )}

      {isFailed && (
        <p className="text-charbon/70 max-w-md">
          Le paiement n&apos;a pas abouti. Vous pouvez réessayer depuis votre panier.
        </p>
      )}

      {!isPaid && !isFailed && (
        <p className="text-charbon/70 max-w-md">
          Nous vérifions la confirmation de votre paiement. Rafraîchissez cette page dans
          quelques instants.
        </p>
      )}

      <Link href="/" className="mt-4 px-8 py-4 bg-charbon text-ivoire text-sm">
        Retour à la boutique
      </Link>
    </div>
  );
}
