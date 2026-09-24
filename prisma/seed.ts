import { PrismaClient, Univers } from "@prisma/client";

const prisma = new PrismaClient();

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const categories: { name: string; univers: Univers }[] = [
  { name: "Abayas", univers: "FEMMES" },
  { name: "Hijabs", univers: "FEMMES" },
  { name: "Ensembles", univers: "FEMMES" },
  { name: "Qamis", univers: "HOMMES" },
  { name: "Ensembles", univers: "HOMMES" },
  { name: "Ensembles", univers: "ENFANTS" },
  { name: "Robes", univers: "ENFANTS" },
];

const products: {
  name: string;
  categoryName: string;
  univers: Univers;
  priceCfa: number;
  description: string;
  sizes: string[];
  colors: string[];
  isNew?: boolean;
}[] = [
  {
    name: "Abaya Layla",
    categoryName: "Abayas",
    univers: "FEMMES",
    priceCfa: 42000,
    description: "Abaya fluide en crepe, coupe evasee et manches larges. Doublure interieure incluse.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Sable", "Noir", "Vert olive"],
    isNew: true,
  },
  {
    name: "Abaya Nour",
    categoryName: "Abayas",
    univers: "FEMMES",
    priceCfa: 39000,
    description: "Abaya boutonnee sur le devant, tissu leger pour un port quotidien.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Ardoise", "Terracotta"],
  },
  {
    name: "Hijab Soie Terracotta",
    categoryName: "Hijabs",
    univers: "FEMMES",
    priceCfa: 12000,
    description: "Hijab en soie de medine, tombe fluide, ne glisse pas.",
    sizes: ["Taille unique"],
    colors: ["Terracotta", "Sable", "Vert olive", "Noir"],
    isNew: true,
  },
  {
    name: "Ensemble Salma",
    categoryName: "Ensembles",
    univers: "FEMMES",
    priceCfa: 35000,
    description: "Tunique longue et pantalon large assorti, coton bio.",
    sizes: ["S", "M", "L"],
    colors: ["Beige", "Bleu nuit"],
  },
  {
    name: "Qamis Amir",
    categoryName: "Qamis",
    univers: "HOMMES",
    priceCfa: 38000,
    description: "Qamis classique col mao, tissu respirant pour toute la journee.",
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["Ardoise", "Blanc", "Noir"],
    isNew: true,
  },
  {
    name: "Qamis Yusuf",
    categoryName: "Qamis",
    univers: "HOMMES",
    priceCfa: 41000,
    description: "Qamis brode au col, coupe droite, tissu epais pour l'hiver.",
    sizes: ["M", "L", "XL"],
    colors: ["Vert olive", "Marine"],
  },
  {
    name: "Ensemble Bilal",
    categoryName: "Ensembles",
    univers: "HOMMES",
    priceCfa: 33000,
    description: "Haut col rond et pantalon droit assorti, coton doux.",
    sizes: ["M", "L", "XL"],
    colors: ["Gris", "Beige"],
  },
  {
    name: "Ensemble Nour Enfant",
    categoryName: "Ensembles",
    univers: "ENFANTS",
    priceCfa: 19500,
    description: "Ensemble deux pieces pour enfant, coton doux, facile a laver.",
    sizes: ["4-5 ans", "6-7 ans", "8-9 ans", "10-11 ans"],
    colors: ["Rose poudre", "Sable"],
    isNew: true,
  },
  {
    name: "Robe Amina",
    categoryName: "Robes",
    univers: "ENFANTS",
    priceCfa: 21000,
    description: "Robe longue avec hijab assorti pour petite fille.",
    sizes: ["4-5 ans", "6-7 ans", "8-9 ans"],
    colors: ["Terracotta", "Vert d'eau"],
  },
  {
    name: "Qamis Junior",
    categoryName: "Ensembles",
    univers: "ENFANTS",
    priceCfa: 18000,
    description: "Qamis enfant pour les occasions et la priere, tissu leger.",
    sizes: ["4-5 ans", "6-7 ans", "8-9 ans", "10-11 ans"],
    colors: ["Blanc", "Ardoise"],
  },
];

async function main() {
  const categoryIds = new Map<string, string>();

  for (const c of categories) {
    const slug = slugify(`${c.univers}-${c.name}`);
    const created = await prisma.category.upsert({
      where: { slug },
      update: {},
      create: { name: c.name, slug, univers: c.univers },
    });
    categoryIds.set(`${c.univers}-${c.name}`, created.id);
  }

  for (const p of products) {
    const slug = slugify(p.name);
    const categoryId = categoryIds.get(`${p.univers}-${p.categoryName}`);
    if (!categoryId) throw new Error(`Categorie introuvable pour ${p.name}`);

    await prisma.product.upsert({
      where: { slug },
      update: {},
      create: {
        name: p.name,
        slug,
        description: p.description,
        priceCfa: p.priceCfa,
        univers: p.univers,
        categoryId,
        images: JSON.stringify(["/produits/placeholder.svg"]),
        sizes: JSON.stringify(p.sizes),
        colors: JSON.stringify(p.colors),
        stock: 25,
        isNew: p.isNew ?? false,
      },
    });
  }

  console.log(`Seed termine : ${categories.length} categories, ${products.length} produits.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
