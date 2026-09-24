import Link from "next/link";
import { formatCfa } from "@/lib/format";
import type { ProductView } from "@/lib/types";

export function ProductCard({ product }: { product: ProductView }) {
  return (
    <Link href={`/produit/${product.slug}`} className="group flex flex-col gap-3">
      <div className="w-full aspect-[3/4] overflow-hidden bg-sable relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
        />
        {product.isNew && (
          <span className="absolute top-3 left-3 text-xs bg-charbon text-ivoire px-2 py-1">
            Nouveau
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-sm">{product.name}</span>
        <span className="text-sm text-terracotta">{formatCfa(product.priceCfa)}</span>
      </div>
    </Link>
  );
}
