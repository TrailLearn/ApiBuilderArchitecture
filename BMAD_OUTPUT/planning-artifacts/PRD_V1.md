# Product Requirements Document (PRD) - Scholarships API Builder V1

**Date :** 30 Janvier 2026  
**Status :** VALIDÉ  
**Phase Actuelle :** 1 (The Pipes)

## 1. Vision & Problème
Fournir une source unique de vérité fiable pour les bourses d'études en automatisant l'ingestion et en imposant un workflow de validation strict ("Trust First").

## 2. Cibles Utilisateurs
- **Anonymous :** Lecteur de données validées.
- **User :** Contributeur authentifié.
- **Admin :** Garant de la qualité et de la publication.

## 3. Périmètre V1 (In Scope)
- Ingestion multi-sources (User, API, Scraping).
- Stockage Raw (Storage) / Staged (DB) / Final (DB).
- Workflow de validation Admin (Pending -> Review -> Approved).
- Boucle de revalidation annuelle (Freshness).
- RLS strict sur Supabase.

## 4. Contraintes Techniques
- Supabase Free Tier.
- Architecture Serverless Light.
- Traçabilité totale (Source -> Publication).

## 5. KPIs
- 0% de bourses actives avec liens morts.
- 100% de fraîcheur (< 1 an).
