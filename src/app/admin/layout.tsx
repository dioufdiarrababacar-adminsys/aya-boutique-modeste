import type { ReactNode } from "react";

export const metadata = {
  title: "Admin — Aya",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-ivoire text-charbon font-sans">{children}</div>;
}
