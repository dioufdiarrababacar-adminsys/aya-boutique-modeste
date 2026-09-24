"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { toSlug } from "@/lib/format";
import type { Univers } from "@/lib/types";

function parseListField(raw: string): string[] {
  return raw
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

async function ensureCategory(name: string, univers: Univers): Promise<string> {
  const slug = toSlug(`${univers}-${name}`);
  const category = await prisma.category.upsert({
    where: { slug },
    update: {},
    create: { name, slug, univers },
  });
  return category.id;
}

export async function createProductAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const univers = String(formData.get("univers") ?? "") as Univers;
  const categoryName = String(formData.get("categoryName") ?? "").trim();
  const priceCfa = Number(formData.get("priceCfa"));
  const description = String(formData.get("description") ?? "").trim();
  const sizes = parseListField(String(formData.get("sizes") ?? ""));
  const colors = parseListField(String(formData.get("colors") ?? ""));
  const stock = Number(formData.get("stock") ?? 0);
  const isNew = formData.get("isNew") === "on";

  if (!name || !univers || !categoryName || !Number.isFinite(priceCfa)) {
    throw new Error("Champs obligatoires manquants");
  }

  const categoryId = await ensureCategory(categoryName, univers);
  const slug = toSlug(name);

  await prisma.product.create({
    data: {
      name,
      slug,
      description,
      priceCfa,
      univers,
      categoryId,
      images: JSON.stringify(["/produits/placeholder.svg"]),
      sizes: JSON.stringify(sizes.length ? sizes : ["Taille unique"]),
      colors: JSON.stringify(colors.length ? colors : ["Standard"]),
      stock: Number.isFinite(stock) ? stock : 0,
      isNew,
    },
  });

  revalidatePath("/admin/produits");
  revalidatePath("/");
  redirect("/admin/produits");
}

export async function updateProductAction(productId: string, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const univers = String(formData.get("univers") ?? "") as Univers;
  const categoryName = String(formData.get("categoryName") ?? "").trim();
  const priceCfa = Number(formData.get("priceCfa"));
  const description = String(formData.get("description") ?? "").trim();
  const sizes = parseListField(String(formData.get("sizes") ?? ""));
  const colors = parseListField(String(formData.get("colors") ?? ""));
  const stock = Number(formData.get("stock") ?? 0);
  const isNew = formData.get("isNew") === "on";
  const isActive = formData.get("isActive") === "on";

  const categoryId = await ensureCategory(categoryName, univers);

  await prisma.product.update({
    where: { id: productId },
    data: {
      name,
      description,
      priceCfa,
      univers,
      categoryId,
      sizes: JSON.stringify(sizes.length ? sizes : ["Taille unique"]),
      colors: JSON.stringify(colors.length ? colors : ["Standard"]),
      stock: Number.isFinite(stock) ? stock : 0,
      isNew,
      isActive,
    },
  });

  revalidatePath("/admin/produits");
  revalidatePath("/");
  redirect("/admin/produits");
}

export async function archiveProductAction(productId: string) {
  // Archivage plutot que suppression : un produit deja commande ne peut pas
  // etre supprime sans casser l'historique des commandes passees.
  await prisma.product.update({ where: { id: productId }, data: { isActive: false } });
  revalidatePath("/admin/produits");
  revalidatePath("/");
  redirect("/admin/produits");
}
