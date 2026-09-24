import Link from "next/link";
import type { ReactNode } from "react";
import { AdminLogoutButton } from "@/components/admin-logout-button";

const NAV = [
  { href: "/admin", label: "Tableau de bord" },
  { href: "/admin/produits", label: "Produits" },
  { href: "/admin/commandes", label: "Commandes" },
];

export default function AdminProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-56 shrink-0 border-r border-sable-fonce px-6 py-8 flex flex-col gap-8">
        <span className="font-serif text-xl">Aya Admin</span>
        <nav className="flex flex-col gap-3 text-sm">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-terracotta">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto">
          <AdminLogoutButton />
        </div>
      </aside>
      <div className="flex-1 px-10 py-8">{children}</div>
    </div>
  );
}
