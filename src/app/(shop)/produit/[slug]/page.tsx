import { notFound } from "next/navigation";
import { AddToCartForm } from "@/components/add-to-cart-form";
import { formatCfa } from "@/lib/format";
import { getProductBySlug } from "@/lib/products";

export default async function ProductPage({ params }: PageProps<"/produit/[slug]">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-14">
      <div className="w-full aspect-[3/4] bg-sable overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
      </div>

      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-wide text-terracotta">
            {product.categoryName}
          </span>
          <h1 className="text-3xl">{product.name}</h1>
          <span className="text-lg text-terracotta">{formatCfa(product.priceCfa)}</span>
        </div>

        <p className="text-charbon/70 leading-relaxed">{product.description}</p>

        <AddToCartForm product={product} />
      </div>
    </div>
  );
}
