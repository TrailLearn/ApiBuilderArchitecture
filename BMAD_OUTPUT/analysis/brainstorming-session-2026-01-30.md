---
stepsCompleted: [1, 2, 3, 4]
techniques_used: ['Morphological Analysis', 'Decision Tree Mapping', 'Chaos Engineering', 'Supabase Serverless Adaptation', 'Frontend & Auth Integration']
ideas_generated: ['Architecture Lakehouse', 'Workflow de Validation Hybride', 'Robustesse par l\'Immuabilité', 'Supabase Serverless Adaptation', 'Freshness Loop']
technique_execution_complete: true
workflow_completed: true
session_active: false
context_file: ''
---

# Architecture de Référence : API Builder Bourses (Baseline)

**Facilitateur:** aubinaso
**Date:** 2026-01-30
**Status:** ✅ VALIDÉE (Mise à jour v3 - Multi-Sources)

---

## 1. Vision et Contraintes Non Négociables

Ce document définit l'architecture technique officielle pour le projet "Scholarship API Builder". Cette version inclut l'application Frontend, le cycle de revalidation, et la gestion explicite des sources hétérogènes (Scraping, API, User).

### Contraintes "Hard" (MVP Free-Tier)
*   **Infrastructure :** 100% **Supabase** (Serverless) + Frontend externe (Vercel/Netlify).
*   **Données :** Ingestion multi-sources (Fichiers Raw distincts).
*   **Sécurité :** RBAC natif via **Postgres RLS** (Row Level Security).
*   **Fraîcheur :** Processus annuel de revalidation adapté au type de source.

---

## 2. Architecture Globale (Vue Synthétique)

Le système combine un Frontend pour l\'humain et des Edge Functions pour les tâches de fond, articulés autour de Postgres.

```mermaid
graph TD
    subgraph "Utilisateurs & Sources"
        Public[Public Visitor] -->|Read Validated| API
        User[Auth User] -->|Submit Form| API
        Scraper[Scraper Script] -->|Upload JSON| API
        ExtAPI[Public API Fetcher] -->|Upload JSON| API
    end

    subgraph "Supabase Core"
        API[Supabase Client (PostgREST)]
        
        subgraph "Raw Zone (Storage)"
            B1[Bucket: /user_submission]
            B2[Bucket: /scraping]
            B3[Bucket: /public_api]
        end

        subgraph "Database (Postgres)"
            Staged[Table: scholarships_staging]
            Final[Table: scholarships_public]
            Queue[Table: ingestion_queue]
            RLS[RLS Security Layer]
        end
        
        Logic[Edge Functions: Ingest/Reverify]
    end

    %% Flux
    User & Scraper & ExtAPI --> Logic
    Logic --> B1 & B2 & B3
    Logic --> Queue
    Queue --> Staged
    Staged --> Final
```

---

## 3. Synthèse des Fonctionnalités

### A. Gestion Multi-Sources (Raw Zone)
La zone Raw est segmentée pour garantir la traçabilité :
1.  **Scraping :** Fichiers JSON issus de robots. Confiance faible. Besoin de revalidation technique (HTTP check).
2.  **Public API :** Fichiers JSON issus de partenaires (ex: data.gouv). Confiance moyenne. Revalidation technique.
3.  **User Submission :** Formulaires POST. Confiance faible. Revalidation par email ou admin.

### B. Application Frontend & Rôles
*   **Anonymous :** Lecture seule catalogue public.
*   **User :** Soumet et suit SES bourses.
*   **Admin :** Valide tout type de source (User ou Scraper).

### C. Cycle de Vie & Revalidation
*   **Ingestion :** Tout atterrit dans `Staged` avec une référence `source_type`.
*   **Fraîcheur :** Le CRON nocturne adapte sa stratégie :
    *   Si source = API/Scraper -> Vérifie l\'URL source.
    *   Si source = User -> Envoie un mail (hors MVP) ou marque `NEEDS_REVIEW` pour l\'admin.

---

## 4. Documents de Référence

*   [01-Architecture.md](./01-Architecture.md) : Modèles de données, Mapping Supabase, Définition Frontend.
*   [02-Flux-Donnees.md](./02-Flux-Donnees.md) : User Journeys, Flux Multi-Sources, RLS Policies.
*   [03-Robustesse.md](./03-Robustesse.md) : Gestion des pannes, Quotas Free-tier, Freshness Loop.

---

## 5. Out of Scope (Exclusions Volontaires)

1.  **CMS Admin riche :** L\'interface admin sera fonctionnelle mais basique (CRUD).
2.  **Notification Push :** Pas de websockets temps réel complexes pour le statut.
3.  **Payment Processing :** Le système est gratuit/informatif.

---

**Fin de Session.**
L'architecture v3 est validée. Prêt pour l'implémentation.