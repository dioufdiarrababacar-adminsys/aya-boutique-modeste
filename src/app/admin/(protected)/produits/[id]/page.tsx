import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { archiveProductAction, updateProductAction } from "@/lib/actions/products";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: PageProps<"/admin/produits/[id]">) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id }, include: { category: true } });
  if (!product) notFound();

  const sizes = (JSON.parse(product.sizes) as string[]).join(", ");
  const colors = (JSON.parse(product.colors) as string[]).join(", ");

  const updateWithId = updateProductAction.bind(null, product.id);
  const archiveWithId = archiveProductAction.bind(null, product.id);

  return (
    <div className="flex flex-col gap-8 max-w-xl">
      <h1 className="text-2xl">{product.name}</h1>

      <form action={updateWithId} className="flex flex-col gap-5">
        <label className="flex flex-col gap-1 text-sm">
          Nom
          <input name="name" defaultValue={product.name} required className="border border-sable-fonce px-4 py-3 text-sm" />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Univers
          <select name="univers" defaultValue={product.univers} required className="border border-sable-fonce px-4 py-3 text-sm">
            <option value="FEMMES">Femmes</option>
            <option value="HOMMES">Hommes</option>
            <option value="ENFANTS">Enfants</option>
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Catégorie
          <input
            name="categoryName"
            defaultValue={product.category.name}
            required
            className="border border-sable-fonce px-4 py-3 text-sm"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Prix (F CFA)
          <input
            name="priceCfa"
            type="number"
            min={0}
            defaultValue={product.priceCfa}
            required
            className="border border-sable-fonce px-4 py-3 text-sm"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Description
          <textarea
            name="description"
            rows={4}
            defaultValue={product.description}
            className="border border-sable-fonce px-4 py-3 text-sm"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Tailles (séparées par une virgule)
          <input name="sizes" defaultValue={sizes} className="border border-sable-fonce px-4 py-3 text-sm" />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Couleurs (séparées par une virgule)
          <input name="colors" defaultValue={colors} className="border border-sable-fonce px-4 py-3 text-sm" />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Stock
          <input
            name="stock"
            type="number"
            min={0}
            defaultValue={product.stock}
            className="border border-sable-fonce px-4 py-3 text-sm"
          />
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input name="isNew" type="checkbox" defaultChecked={product.isNew} />
          Marquer comme nouveauté
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input name="isActive" type="checkbox" defaultChecked={product.isActive} />
          Visible sur la boutique
        </label>

        <button type="submit" className="mt-2 px-6 py-3 bg-charbon text-ivoire text-sm w-fit">
          Enregistrer
        </button>
      </form>

      {product.isActive && (
        <form action={archiveWithId}>
          <button type="submit" className="text-sm text-red-700">
            Archiver ce produit
          </button>
        </form>
      )}
    </div>
  );
}
