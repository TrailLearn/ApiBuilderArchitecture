# Guide de Configuration (Supabase & Vercel)

Ce guide vous accompagne pas à pas pour configurer votre infrastructure, même si vous n'avez jamais utilisé ces outils.

## 1. Supabase (Votre Base de Données et Authentification)

Supabase est le "cerveau" de votre application. Il stocke les données et gère les utilisateurs.

### Création du projet
1. Allez sur [supabase.com](https://supabase.com/) et créez un compte gratuit.
2. Cliquez sur **"New Project"**.
3. Choisissez un nom (ex: `ScholarshipsBuilder`) et un mot de passe pour la base de données (**Notez-le bien !**).
4. Sélectionnez la région la plus proche de vous et cliquez sur **"Create new project"**.

### Récupération des clés (Indispensable pour l'app)
1. Une fois le projet prêt, allez dans **Project Settings** (l'icône engrenage en bas à gauche).
2. Cliquez sur **API**.
3. Copiez l'URL (**Project URL**) et la clé **anon public** (Project API keys).
4. Collez ces valeurs dans votre fichier `.env` à la racine du projet :
   - `VITE_SUPABASE_URL=votre_url_ici`
   - `VITE_SUPABASE_ANON_KEY=votre_cle_anon_ici`

### Gestion des Migrations (Mon Rôle)
En tant qu'Agent Développeur, **j'utilise Prisma** pour gérer la base de données.
1. Configurez votre `DATABASE_URL` dans le fichier `.env`.
2. Pour mettre à jour la base de données, lancez : `npm run migrate`.
3. **Sécurité (RLS) :** Prisma ne gère pas les politiques de sécurité (RLS). Après chaque création de table, je vous fournirai un fichier `.sql` dans le dossier `prisma/` (ex: `RLS_POLICIES.sql`) à copier-coller dans le SQL Editor de Supabase pour activer la sécurité.

---

## 2. Vercel (Hébergement de votre site)

Vercel permet de rendre votre site accessible en ligne gratuitement.

### Déploiement initial
1. Créez un compte sur [vercel.com](https://vercel.com/) (connectez-le à votre compte GitHub).
2. Cliquez sur **"Add New"** > **"Project"**.
3. Importez votre dépôt GitHub `ApiBuilderArchitecture`.
4. **Configuration critique (Environment Variables) :**
   - Avant de cliquer sur "Deploy", cherchez la section **Environment Variables**.
   - Ajoutez les mêmes clés que dans votre fichier `.env` :
     - Name: `VITE_SUPABASE_URL` | Value: `(votre url)`
     - Name: `VITE_SUPABASE_ANON_KEY` | Value: `(votre clé)`
5. Cliquez sur **"Deploy"**. Votre site sera en ligne en quelques secondes !

---

## 3. Suivi des Mises à jour de l'App

À chaque fois que je termine une fonctionnalité (Story) :
1. **Code :** Je mets à jour les fichiers dans `/src`. Si vous avez déployé sur Vercel via GitHub, Vercel mettra à jour le site automatiquement à chaque "push".
2. **Base de données :** S'il y a une nouvelle migration, je vous préviendrai. Vous devrez l'appliquer dans le SQL Editor de Supabase (voir section 1).
3. **Documentation :** Je mettrai à jour ce guide ou les fichiers de story pour refléter les changements.

**Conseil :** Gardez toujours un œil sur le fichier `BMAD_OUTPUT/implementation-artifacts/sprint-status.yaml` pour voir l'avancement global du projet.
