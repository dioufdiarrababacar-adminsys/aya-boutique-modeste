export type Univers = "FEMMES" | "HOMMES" | "ENFANTS";

export type ProductView = {
  id: string;
  name: string;
  slug: string;
  description: string;
  priceCfa: number;
  univers: Univers;
  categoryName: string;
  categorySlug: string;
  images: string[];
  sizes: string[];
  colors: string[];
  stock: number;
  isNew: boolean;
};

export const UNIVERS_LABELS: Record<Univers, string> = {
  FEMMES: "Femmes",
  HOMMES: "Hommes",
  ENFANTS: "Enfants",
};

export const UNIVERS_SLUGS: Record<Univers, string> = {
  FEMMES: "femmes",
  HOMMES: "hommes",
  ENFANTS: "enfants",
};

export const SLUG_TO_UNIVERS: Record<string, Univers> = {
  femmes: "FEMMES",
  hommes: "HOMMES",
  enfants: "ENFANTS",
};
