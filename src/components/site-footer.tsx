import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="w-full bg-sable">
      <div className="mx-auto max-w-7xl px-6 py-16 flex flex-col gap-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          <div className="flex flex-col gap-3">
            <span className="font-serif text-xl">Aya</span>
            <p className="text-sm text-charbon/70 max-w-[240px]">
              Vêtements modestes pour femmes, hommes et enfants, pensés à Dakar.
            </p>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <span className="text-charbon mb-1">Boutique</span>
            <Link href="/femmes" className="text-charbon/70 hover:text-terracotta">Femmes</Link>
            <Link href="/hommes" className="text-charbon/70 hover:text-terracotta">Hommes</Link>
            <Link href="/enfants" className="text-charbon/70 hover:text-terracotta">Enfants</Link>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <span className="text-charbon mb-1">Aide</span>
            <span className="text-charbon/70">Livraison & retours</span>
            <span className="text-charbon/70">Guide des tailles</span>
            <span className="text-charbon/70">Contact WhatsApp</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between gap-2 pt-6 border-t border-sable-fonce text-xs text-charbon/50">
          <span>© {new Date().getFullYear()} Aya. Tous droits réservés.</span>
          <span>Mentions légales · Confidentialité</span>
        </div>
      </div>
    </footer>
  );
}
