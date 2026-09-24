import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCfa } from "@/lib/format";
import type { OrderStatus } from "@prisma/client";

const STATUS_LABELS: Record<OrderStatus, string> = {
  NOUVELLE: "Nouvelle",
  EN_PREPARATION: "En préparation",
  EXPEDIEE: "Expédiée",
  LIVREE: "Livrée",
  ANNULEE: "Annulée",
};

export default async function AdminOrdersPage({ searchParams }: PageProps<"/admin/commandes">) {
  const { status } = await searchParams;
  const statusFilter = typeof status === "string" ? (status as OrderStatus) : undefined;

  const orders = await prisma.order.findMany({
    where: statusFilter ? { status: statusFilter } : undefined,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl">Commandes</h1>

      <div className="flex gap-2 flex-wrap text-sm">
        <Link
          href="/admin/commandes"
          className={`px-3 py-2 border ${!statusFilter ? "border-charbon" : "border-sable-fonce"}`}
        >
          Toutes
        </Link>
        {(Object.keys(STATUS_LABELS) as OrderStatus[]).map((s) => (
          <Link
            key={s}
            href={`/admin/commandes?status=${s}`}
            className={`px-3 py-2 border ${statusFilter === s ? "border-charbon" : "border-sable-fonce"}`}
          >
            {STATUS_LABELS[s]}
          </Link>
        ))}
      </div>

      <div className="flex flex-col border border-sable-fonce divide-y divide-sable-fonce">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/admin/commandes/${order.id}`}
            className="p-4 flex flex-wrap justify-between gap-2 items-center text-sm hover:bg-sable/50"
          >
            <span className="w-36">{order.reference}</span>
            <span className="text-charbon/60">{order.customerName}</span>
            <span>{formatCfa(order.totalCfa)}</span>
            <span
              className={`text-xs px-2 py-1 ${
                order.paymentStatus === "PAID" ? "bg-green-100 text-green-800" : "bg-sable"
              }`}
            >
              {order.paymentStatus === "PAID" ? "Payée" : order.paymentStatus === "FAILED" ? "Échouée" : "En attente"}
            </span>
            <span className="text-xs px-2 py-1 bg-sable">{STATUS_LABELS[order.status]}</span>
          </Link>
        ))}
        {orders.length === 0 && (
          <p className="p-5 text-sm text-charbon/50">Aucune commande pour ce filtre.</p>
        )}
      </div>
    </div>
  );
}
