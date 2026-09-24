# Aya — Boutique e-commerce habits modestes

Site e-commerce pour la vente de vêtements modestes (femmes, hommes, enfants).
Catalogue, panier, paiement en ligne (Wave, Orange Money, Free Money, carte
bancaire via PayDunya) et back-office admin, sans compte client.

**Statut :** en développement. Dépôt privé :
https://github.com/dioufdiarrababacar-adminsys/aya-boutique-modeste

## Stack technique

- Next.js 16 (App Router, TypeScript, Tailwind CSS v4)
- Prisma + Postgres (Neon)
- Zustand pour le panier (persisté en localStorage)
- PayDunya pour le paiement (agrégateur sénégalais : Wave, Orange Money, Free
  Money, carte Visa/Mastercard en une seule intégration)
- Authentification admin maison (un seul compte, cookie de session signé,
  pas de comptes clients)

## Installation

```bash
npm install
cp .env.example .env   # puis renseigner les valeurs (voir ci-dessous)
npx prisma migrate dev
npm run seed            # remplit le catalogue avec des produits d'exemple
npm run dev
```

Le site est alors sur http://localhost:3000, le back-office sur
http://localhost:3000/admin.

## Variables d'environnement (.env)

| Variable | Description |
|---|---|
| `DATABASE_URL` | Connexion Postgres (ex. Neon : https://neon.tech, tier gratuit) |
| `ADMIN_EMAIL` | Email du compte admin |
| `ADMIN_PASSWORD_HASH` | Hash bcrypt du mot de passe admin (voir commande ci-dessous) |
| `ADMIN_SESSION_SECRET` | Chaîne aléatoire longue, signe le cookie de session |
| `PAYDUNYA_MASTER_KEY` / `PAYDUNYA_PRIVATE_KEY` / `PAYDUNYA_TOKEN` | Clés du compte marchand PayDunya (https://paydunya.com) |
| `PAYDUNYA_MODE` | `test` (sandbox) ou `live` (production) |
| `NEXT_PUBLIC_SITE_URL` | URL publique du site, utilisée pour les redirections de paiement |

Générer un nouveau hash de mot de passe admin :

```bash
node -e "console.log(require('bcryptjs').hashSync('ton-mot-de-passe', 10))"
```

**Piège important :** dans le `.env`, il faut échapper chaque `$` du hash
bcrypt en `\$` (ex. `\$2b\$10\$...`). Next.js interprète sinon `$2b`, `$10`,
etc. comme des références de variables d'environnement et les vide
silencieusement, ce qui casse le mot de passe admin sans erreur visible.

## Ce qui reste à faire avant une mise en ligne réelle

- **Compte marchand PayDunya** : créer le compte sur paydunya.com, passer la
  vérification KYC, récupérer les vraies clés API et les mettre dans `.env`
  (mode `live`).
- **Photos produits** : remplacer les placeholders (`/produits/placeholder.svg`)
  par de vraies photos. Prévoir un hébergement d'images (ex. Cloudinary,
  ou un dossier `public/produits/` si peu de produits).
- **Hébergement** : déployé sur Netlify (Next.js Runtime), connecté au dépôt
  GitHub. Base Neon déjà en place.
- **Nom de domaine** et déclaration du numéro de téléphone / WhatsApp pour le
  service client dans le footer.
- **Mentions légales / CGV** : pages actuellement en texte statique dans le
  footer, à compléter.
- Changer le mot de passe admin généré automatiquement au premier lancement.

## Structure

```
src/
├── app/
│   ├── (shop)/          # pages publiques : accueil, catégories, produit, panier, commande
│   ├── admin/            # back-office (protégé par src/proxy.ts)
│   └── api/               # routes API : checkout, webhooks PayDunya, auth admin
├── components/            # composants partagés (header, footer, carte produit, panier)
├── lib/
│   ├── actions/           # server actions (CRUD produits, statut commandes)
│   ├── payments/          # intégration PayDunya
│   ├── cart-store.ts       # panier (zustand + localStorage)
│   ├── orders.ts            # création de commande côté serveur
│   └── products.ts           # lecture catalogue depuis la base
└── proxy.ts                # protège /admin et /api/admin (auth requise)

prisma/
├── schema.prisma           # modèles Product, Category, Order, OrderItem
└── seed.ts                  # données d'exemple (10 produits, 3 univers)
```

## Inputs

Pas d'input externe pour l'instant. La maquette visuelle de départ a été
produite comme artefact Claude (voir échange du 2026-09-23), non stockée en
fichier — le design du code source ci-dessus en reprend la palette et la
structure.
