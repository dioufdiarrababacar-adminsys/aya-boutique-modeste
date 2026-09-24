"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCartStore } from "@/lib/cart-store";
import type { ProductView } from "@/lib/types";

export function AddToCartForm({ product }: { product: ProductView }) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const [size, setSize] = useState(product.sizes[0] ?? "");
  const [color, setColor] = useState(product.colors[0] ?? "");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: product.images[0],
      size,
      color,
      unitPriceCfa: product.priceCfa,
      quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="text-sm">Taille</span>
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSize(s)}
              className={`px-4 py-2 text-sm border ${
                size === s ? "border-charbon bg-charbon text-ivoire" : "border-sable-fonce"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm">Couleur</span>
        <div className="flex flex-wrap gap-2">
          {product.colors.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`px-4 py-2 text-sm border ${
                color === c ? "border-charbon bg-charbon text-ivoire" : "border-sable-fonce"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm">Quantité</span>
        <div className="flex items-center gap-3 w-fit border border-sable-fonce">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-9 h-9"
          >
            −
          </button>
          <span className="w-6 text-center">{quantity}</span>
          <button type="button" onClick={() => setQuantity((q) => q + 1)} className="w-9 h-9">
            +
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="button"
          onClick={handleAdd}
          className="px-8 py-4 bg-charbon text-ivoire text-sm tracking-wide"
        >
          {added ? "Ajouté ✓" : "Ajouter au panier"}
        </button>
        <button
          type="button"
          onClick={() => {
            handleAdd();
            router.push("/panier");
          }}
          className="px-8 py-4 border border-charbon text-sm tracking-wide"
        >
          Acheter maintenant
        </button>
      </div>
    </div>
  );
}
