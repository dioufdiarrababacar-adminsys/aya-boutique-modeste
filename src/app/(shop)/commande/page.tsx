"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { cartSubtotal, useCartStore } from "@/lib/cart-store";
import { formatCfa } from "@/lib/format";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Dakar");

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  if (items.length === 0) {
    router.replace("/panier");
    return null;
  }

  const subtotal = cartSubtotal(items);
  const isDakar = city.trim().toLowerCase().includes("dakar");
  const deliveryFee = isDakar ? 2000 : 3500;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { name, phone, email: email || undefined, address, city },
          items: items.map((i) => ({
            productId: i.productId,
            size: i.size,
            color: i.color,
            quantity: i.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Une erreur est survenue, réessaie.");
        setSubmitting(false);
        return;
      }

      window.location.href = data.redirectUrl;
    } catch {
      setError("Impossible de contacter le serveur, réessaie.");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-14">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <h1 className="text-2xl mb-2">Livraison</h1>

        <label className="flex flex-col gap-1 text-sm">
          Nom complet
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-sable-fonce px-4 py-3 text-sm"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Téléphone
          <input
            required
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="77 000 00 00"
            className="border border-sable-fonce px-4 py-3 text-sm"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Email (optionnel)
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-sable-fonce px-4 py-3 text-sm"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Ville
          <input
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="border border-sable-fonce px-4 py-3 text-sm"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Adresse de livraison
          <textarea
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
            className="border border-sable-fonce px-4 py-3 text-sm"
          />
        </label>

        {error && <p className="text-sm text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 px-8 py-4 bg-charbon text-ivoire text-sm tracking-wide disabled:opacity-50"
        >
          {submitting ? "Redirection vers le paiement…" : "Continuer vers le paiement"}
        </button>
        <p className="text-xs text-charbon/50">
          Tu choisiras Wave, Orange Money, Free Money ou ta carte bancaire sur la page de
          paiement sécurisée suivante.
        </p>
      </form>

      <div className="flex flex-col gap-4 h-fit border border-sable-fonce p-6">
        <h2 className="text-lg">Récapitulatif</h2>
        {items.map((item) => (
          <div key={`${item.productId}-${item.size}-${item.color}`} className="flex justify-between text-sm">
            <span>
              {item.name} × {item.quantity}
              <span className="text-charbon/50"> ({item.size}, {item.color})</span>
            </span>
            <span>{formatCfa(item.unitPriceCfa * item.quantity)}</span>
          </div>
        ))}
        <div className="flex justify-between text-sm pt-3 border-t border-sable-fonce">
          <span>Sous-total</span>
          <span>{formatCfa(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Livraison ({isDakar ? "Dakar" : "Hors Dakar"})</span>
          <span>{formatCfa(deliveryFee)}</span>
        </div>
        <div className="flex justify-between text-base pt-3 border-t border-sable-fonce">
          <span>Total</span>
          <span>{formatCfa(subtotal + deliveryFee)}</span>
        </div>
      </div>
    </div>
  );
}
