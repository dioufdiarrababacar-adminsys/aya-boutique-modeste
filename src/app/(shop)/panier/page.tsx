"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cartSubtotal, useCartStore } from "@/lib/cart-store";
import { formatCfa } from "@/lib/format";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 flex flex-col items-center gap-6 text-center">
        <h1 className="text-2xl">Votre panier est vide</h1>
        <Link href="/femmes" className="px-8 py-4 bg-charbon text-ivoire text-sm">
          Découvrir la collection
        </Link>
      </div>
    );
  }

  const subtotal = cartSubtotal(items);

  return (
    <div className="mx-auto max-w-4xl px-6 py-16 flex flex-col gap-10">
      <h1 className="text-3xl">Votre panier</h1>

      <div className="flex flex-col divide-y divide-sable-fonce">
        {items.map((item) => (
          <div
            key={`${item.productId}-${item.size}-${item.color}`}
            className="py-6 flex gap-5 items-center"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.image} alt={item.name} className="w-24 h-32 object-cover bg-sable shrink-0" />
            <div className="flex-1 flex flex-col gap-1">
              <span>{item.name}</span>
              <span className="text-sm text-charbon/60">
                Taille {item.size} · {item.color}
              </span>
              <span className="text-sm text-terracotta">{formatCfa(item.unitPriceCfa)}</span>
            </div>
            <div className="flex items-center gap-3 border border-sable-fonce">
              <button
                type="button"
                className="w-8 h-8"
                onClick={() => setQuantity(item.productId, item.size, item.color, item.quantity - 1)}
              >
                −
              </button>
              <span className="w-6 text-center text-sm">{item.quantity}</span>
              <button
                type="button"
                className="w-8 h-8"
                onClick={() => setQuantity(item.productId, item.size, item.color, item.quantity + 1)}
              >
                +
              </button>
            </div>
            <button
              type="button"
              onClick={() => removeItem(item.productId, item.size, item.color)}
              className="text-sm text-charbon/50 hover:text-terracotta"
            >
              Retirer
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-end gap-4 pt-6 border-t border-sable-fonce">
        <div className="flex justify-between w-full max-w-xs text-lg">
          <span>Sous-total</span>
          <span>{formatCfa(subtotal)}</span>
        </div>
        <p className="text-xs text-charbon/50 max-w-xs text-right">
          Frais de livraison calculés à l&apos;étape suivante.
        </p>
        <Link
          href="/commande"
          className="px-9 py-4 bg-charbon text-ivoire text-sm tracking-wide"
        >
          Passer la commande
        </Link>
      </div>
    </div>
  );
}
