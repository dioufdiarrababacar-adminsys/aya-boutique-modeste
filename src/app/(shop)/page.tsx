import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { getFeaturedProducts } from "@/lib/products";

const UNIVERS_BLOCKS = [
  { href: "/femmes", label: "Femmes" },
  { href: "/hommes", label: "Hommes" },
  { href: "/enfants", label: "Enfants" },
];

export default async function HomePage() {
  const featured = await getFeaturedProducts(4);

  return (
    <div>
      <section className="flex flex-col items-center text-center gap-6 px-6 py-28 bg-sable">
        <span className="text-xs tracking-[0.18em] uppercase text-terracotta">
          Collection Automne
        </span>
        <h1 className="text-4xl sm:text-5xl max-w-2xl leading-tight">
          La pudeur, dans une matière qui vous ressemble
        </h1>
        <p className="max-w-md text-charbon/70">
          Des pièces intemporelles pensées pour toute la famille, coupées dans des tissus doux
          et respectueux.
        </p>
        <Link
          href="/femmes"
          className="mt-2 px-9 py-4 bg-charbon text-ivoire text-sm tracking-wide"
        >
          Découvrir la collection
        </Link>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {UNIVERS_BLOCKS.map((block) => (
          <Link key={block.href} href={block.href} className="group flex flex-col gap-4">
            <div className="w-full aspect-[3/4] bg-sable-fonce flex items-center justify-center text-sm text-charbon/50">
              [Photo — Univers {block.label}]
            </div>
            <div className="flex justify-between items-baseline">
              <h3 className="text-xl">{block.label}</h3>
              <span className="text-sm text-terracotta">Voir tout →</span>
            </div>
          </Link>
        ))}
      </section>

      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-24 flex flex-col gap-10">
          <div className="flex justify-between items-end">
            <h2 className="text-2xl">Nouveautés</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-7">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      <section className="bg-charbon text-ivoire px-6 py-20 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center text-sm">
        <div>Livraison à Dakar et à l&apos;international</div>
        <div>Tissus certifiés, doux et durables</div>
        <div>Une démarche responsable et locale</div>
        <div>Service client à l&apos;écoute, 7j/7</div>
      </section>
    </div>
  );
}
