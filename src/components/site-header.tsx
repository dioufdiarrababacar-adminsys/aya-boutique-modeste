"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cartItemCount, useCartStore } from "@/lib/cart-store";

const NAV_LINKS = [
  { href: "/femmes", label: "Femmes" },
  { href: "/hommes", label: "Hommes" },
  { href: "/enfants", label: "Enfants" },
];

export function SiteHeader() {
  const items = useCartStore((s) => s.items);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  const count = mounted ? cartItemCount(items) : 0;

  return (
    <header className="w-full sticky top-0 z-20 bg-ivoire/95 backdrop-blur border-b border-sable-fonce">
      <div className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between gap-6">
        <nav className="hidden md:flex flex-1 gap-8 text-sm">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-terracotta transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>

        <Link href="/" className="font-serif text-2xl tracking-wide shrink-0">
          Aya
        </Link>

        <div className="flex-1 flex justify-end">
          <Link
            href="/panier"
            className="text-sm flex items-center gap-2 hover:text-terracotta transition-colors"
          >
            Panier
            {count > 0 && (
              <span className="inline-flex items-center justify-center min-w-5 h-5 px-1 rounded-full bg-charbon text-ivoire text-xs">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      <nav className="md:hidden flex justify-center gap-6 pb-4 text-sm">
        {NAV_LINKS.map((link) => (
          <Link key={link.href} href={link.href} className="hover:text-terracotta transition-colors">
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
