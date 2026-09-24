import { prisma } from "@/lib/prisma";
import type { ProductView, Univers } from "@/lib/types";
import type { Product, Category } from "@prisma/client";

type ProductWithCategory = Product & { category: Category };

function toProductView(product: ProductWithCategory): ProductView {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    priceCfa: product.priceCfa,
    univers: product.univers,
    categoryName: product.category.name,
    categorySlug: product.category.slug,
    images: JSON.parse(product.images) as string[],
    sizes: JSON.parse(product.sizes) as string[],
    colors: JSON.parse(product.colors) as string[],
    stock: product.stock,
    isNew: product.isNew,
  };
}

export async function getFeaturedProducts(limit = 4): Promise<ProductView[]> {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return products.map(toProductView);
}

export async function getProductsByUnivers(univers: Univers): Promise<ProductView[]> {
  const products = await prisma.product.findMany({
    where: { isActive: true, univers },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
  return products.map(toProductView);
}

export async function getProductBySlug(slug: string): Promise<ProductView | null> {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });
  if (!product || !product.isActive) return null;
  return toProductView(product);
}
