import { createProductAction } from "@/lib/actions/products";

export default function NewProductPage() {
  return (
    <div className="flex flex-col gap-8 max-w-xl">
      <h1 className="text-2xl">Nouveau produit</h1>

      <form action={createProductAction} className="flex flex-col gap-5">
        <label className="flex flex-col gap-1 text-sm">
          Nom
          <input name="name" required className="border border-sable-fonce px-4 py-3 text-sm" />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Univers
          <select name="univers" required className="border border-sable-fonce px-4 py-3 text-sm">
            <option value="FEMMES">Femmes</option>
            <option value="HOMMES">Hommes</option>
            <option value="ENFANTS">Enfants</option>
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Catégorie (ex : Abayas, Qamis, Ensembles)
          <input name="categoryName" required className="border border-sable-fonce px-4 py-3 text-sm" />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Prix (F CFA)
          <input
            name="priceCfa"
            type="number"
            min={0}
            required
            className="border border-sable-fonce px-4 py-3 text-sm"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Description
          <textarea name="description" rows={4} className="border border-sable-fonce px-4 py-3 text-sm" />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Tailles (séparées par une virgule)
          <input
            name="sizes"
            placeholder="S, M, L, XL"
            className="border border-sable-fonce px-4 py-3 text-sm"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Couleurs (séparées par une virgule)
          <input
            name="colors"
            placeholder="Sable, Noir"
            className="border border-sable-fonce px-4 py-3 text-sm"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Stock
          <input name="stock" type="number" min={0} defaultValue={0} className="border border-sable-fonce px-4 py-3 text-sm" />
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input name="isNew" type="checkbox" />
          Marquer comme nouveauté
        </label>

        <p className="text-xs text-charbon/50">
          La photo par défaut est un placeholder ; ajoute la vraie photo plus tard depuis la fiche
          produit une fois l&apos;hébergement d&apos;images mis en place.
        </p>

        <button type="submit" className="mt-2 px-6 py-3 bg-charbon text-ivoire text-sm w-fit">
          Créer le produit
        </button>
      </form>
    </div>
  );
}
