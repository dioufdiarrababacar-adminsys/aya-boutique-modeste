import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { getProductsByUnivers } from "@/lib/products";
import { SLUG_TO_UNIVERS, UNIVERS_LABELS } from "@/lib/types";

export default async function UniversPage({ params }: PageProps<"/[univers]">) {
  const { univers: universSlug } = await params;
  const univers = SLUG_TO_UNIVERS[universSlug];
  if (!univers) notFound();

  const products = await getProductsByUnivers(univers);

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl">{UNIVERS_LABELS[univers]}</h1>
        <p className="text-charbon/60 text-sm">{products.length} pièce(s)</p>
      </div>

      {products.length === 0 ? (
        <p className="text-charbon/60">Aucun produit disponible pour l&apos;instant.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-7">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
