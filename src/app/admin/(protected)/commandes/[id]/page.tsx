import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatCfa } from "@/lib/format";
import { updateOrderStatusAction } from "@/lib/actions/orders";
import type { OrderStatus } from "@prisma/client";

const STATUS_OPTIONS: OrderStatus[] = ["NOUVELLE", "EN_PREPARATION", "EXPEDIEE", "LIVREE", "ANNULEE"];
const STATUS_LABELS: Record<OrderStatus, string> = {
  NOUVELLE: "Nouvelle",
  EN_PREPARATION: "En préparation",
  EXPEDIEE: "Expédiée",
  LIVREE: "Livrée",
  ANNULEE: "Annulée",
};

export default async function AdminOrderDetailPage({ params }: PageProps<"/admin/commandes/[id]">) {
  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
  if (!order) notFound();

  async function handleStatusChange(formData: FormData) {
    "use server";
    const status = String(formData.get("status")) as OrderStatus;
    await updateOrderStatusAction(order!.id, status);
  }

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl">{order.reference}</h1>
          <p className="text-sm text-charbon/60">
            {new Date(order.createdAt).toLocaleString("fr-FR")}
          </p>
        </div>
        <span
          className={`text-xs px-3 py-2 ${
            order.paymentStatus === "PAID" ? "bg-green-100 text-green-800" : "bg-sable"
          }`}
        >
          {order.paymentStatus === "PAID"
            ? "Paiement reçu"
            : order.paymentStatus === "FAILED"
              ? "Paiement échoué"
              : "Paiement en attente"}
          {order.paymentMethod ? ` · ${order.paymentMethod}` : ""}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="flex flex-col gap-2 text-sm">
          <h2 className="text-base mb-1">Client</h2>
          <span>{order.customerName}</span>
          <span>{order.customerPhone}</span>
          {order.customerEmail && <span>{order.customerEmail}</span>}
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <h2 className="text-base mb-1">Livraison</h2>
          <span>{order.deliveryAddress}</span>
          <span>{order.deliveryCity}</span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-base">Articles</h2>
        <div className="flex flex-col divide-y divide-sable-fonce border border-sable-fonce">
          {order.items.map((item) => (
            <div key={item.id} className="p-4 flex justify-between text-sm">
              <span>
                {item.productName} × {item.quantity}
                <span className="text-charbon/50"> ({item.size}, {item.color})</span>
              </span>
              <span>{formatCfa(item.unitPriceCfa * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-end gap-1 text-sm pt-2">
          <span>Sous-total : {formatCfa(order.subtotalCfa)}</span>
          <span>Livraison : {formatCfa(order.deliveryFeeCfa)}</span>
          <span className="text-base">Total : {formatCfa(order.totalCfa)}</span>
        </div>
      </div>

      <form action={handleStatusChange} className="flex items-end gap-3">
        <label className="flex flex-col gap-1 text-sm">
          Statut de la commande
          <select name="status" defaultValue={order.status} className="border border-sable-fonce px-4 py-3 text-sm">
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="px-5 py-3 bg-charbon text-ivoire text-sm">
          Mettre à jour
        </button>
      </form>
    </div>
  );
}
