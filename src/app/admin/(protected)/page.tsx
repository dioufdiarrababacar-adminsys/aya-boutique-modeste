import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCfa } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [productCount, orderCount, pendingCount, recentOrders, revenueAgg] = await Promise.all([
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.count(),
    prisma.order.count({ where: { status: "NOUVELLE" } }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
    prisma.order.aggregate({ where: { paymentStatus: "PAID" }, _sum: { totalCfa: true } }),
  ]);

  const stats = [
    { label: "Produits actifs", value: productCount },
    { label: "Commandes totales", value: orderCount },
    { label: "Nouvelles commandes", value: pendingCount },
    { label: "Chiffre d'affaires encaissé", value: formatCfa(revenueAgg._sum.totalCfa ?? 0) },
  ];

  return (
    <div className="flex flex-col gap-10">
      <h1 className="text-2xl">Tableau de bord</h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <div key={stat.label} className="border border-sable-fonce p-5 flex flex-col gap-1">
            <span className="text-xs text-charbon/50">{stat.label}</span>
            <span className="text-2xl">{stat.value}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg">Commandes récentes</h2>
          <Link href="/admin/commandes" className="text-sm text-terracotta">
            Voir tout →
          </Link>
        </div>
        <div className="flex flex-col divide-y divide-sable-fonce border border-sable-fonce">
          {recentOrders.length === 0 && (
            <p className="p-5 text-sm text-charbon/50">Aucune commande pour l&apos;instant.</p>
          )}
          {recentOrders.map((order) => (
            <Link
              key={order.id}
              href={`/admin/commandes/${order.id}`}
              className="p-4 flex justify-between items-center text-sm hover:bg-sable/50"
            >
              <span>{order.reference}</span>
              <span className="text-charbon/60">{order.customerName}</span>
              <span>{formatCfa(order.totalCfa)}</span>
              <span className="text-xs px-2 py-1 bg-sable">{order.status}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
