import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCfa } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl">Produits</h1>
        <Link href="/admin/produits/nouveau" className="px-5 py-3 bg-charbon text-ivoire text-sm">
          + Nouveau produit
        </Link>
      </div>

      <div className="flex flex-col border border-sable-fonce divide-y divide-sable-fonce">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/admin/produits/${product.id}`}
            className={`p-4 flex justify-between items-center text-sm hover:bg-sable/50 ${
              !product.isActive ? "opacity-40" : ""
            }`}
          >
            <span className="w-48 truncate">{product.name}</span>
            <span className="text-charbon/60">{product.category.name}</span>
            <span>{formatCfa(product.priceCfa)}</span>
            <span className="text-charbon/60">Stock : {product.stock}</span>
            {!product.isActive && <span className="text-xs">Archivé</span>}
          </Link>
        ))}
        {products.length === 0 && (
          <p className="p-5 text-sm text-charbon/50">Aucun produit pour l&apos;instant.</p>
        )}
      </div>
    </div>
  );
}
