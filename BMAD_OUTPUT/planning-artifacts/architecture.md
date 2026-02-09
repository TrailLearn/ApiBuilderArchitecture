---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
workflowType: 'architecture'
lastStep: 8
status: 'complete'
completedAt: '2026-01-30'
inputDocuments: ['BMAD_OUTPUT/planning-artifacts/PRD_V1.md']
project_name: 'ApiBuilderArchitecture'
user_name: 'aubinaso'
date: '2026-01-30'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
Le système doit assurer l'ingestion asynchrone depuis trois sources (User, API, Scraping), le stockage immuable des données brutes, un workflow de validation humaine pour les administrateurs, et l'exposition publique des données validées. Une boucle de revalidation annuelle doit automatiquement vérifier la validité des bourses publiées.

**Non-Functional Requirements:**
La sécurité doit être assurée nativement par Supabase Auth et les RLS. Le système doit garantir une traçabilité totale (audit log) et une haute qualité de donnée (fraîcheur < 1 an, 0% de liens morts). L'architecture doit rester légère pour s'insérer dans le Free Tier de Supabase.

**Scale & Complexity:**
Le projet présente une complexité modérée liée à la gestion du cycle de vie des données et aux processus asynchrones de revalidation.

- Primary domain: API / Data Pipeline / Web
- Complexity level: Medium
- Estimated architectural components: ~6 (Ingestion, Storage, Validation Engine, Freshness Cron, Public API, Admin UI)

### Technical Constraints & Dependencies

- Supabase Free Tier (limites de stockage et de fonctions edge).
- Architecture Serverless uniquement.
- Dépendance aux sources externes (disponibilité des APIs/Sites à scraper).

### Cross-Cutting Concerns Identified

- **Sécurité & Permissions :** Gestion fine des rôles (Anon/User/Admin) via RLS.
- **Traçabilité :** Lien immuable entre Raw, Staged et Final.
- **Résilience :** Gestion des pannes d'ingestion et des erreurs de revalidation.

## Starter Template Evaluation

### Primary Technology Domain

Web application (Frontend) + Serverless Backend (Supabase) based on project requirements analysis.

### Starter Options Considered

1.  **chunxchun/erp-starter:** Comprehensive setup with Vite, React, TypeScript, Tailwind CSS, Shadcn UI, and Supabase. Excellent fit for admin dashboard and public frontend.
2.  **Next.js Supabase Starter:** Strong option but potentially heavier (SSR) than needed for a client-heavy dashboard + static public site.
3.  **Plain Vite + Supabase:** Too barebones, requires manual setup of UI components and auth flow.

### Selected Starter: chunxchun/erp-starter

**Rationale for Selection:**
Provides a production-ready foundation with all required components pre-integrated (Auth, UI Kit, Types). The inclusion of Shadcn UI allows for rapid development of the Admin Dashboard. The Vite-based SPA architecture fits perfectly with free static hosting (Vercel) and client-side Supabase interactions.

**Initialization Command:**

```bash
git clone https://github.com/chunxchun/erp-starter.git .
# Customization required: Rebrand UI to "Scholarships Builder Dashboard"
```

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**
TypeScript (Strict mode)

**Styling Solution:**
Tailwind CSS + Shadcn UI

**Build Tooling:**
Vite (Fast, ESM-based)

**Testing Framework:**
Vitest (Unit) + React Testing Library

**Code Organization:**
Feature-based folder structure (components, hooks, pages, lib)

**Development Experience:**
Hot Module Replacement (HMR), Typed Supabase Client generation.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- Data Modeling Strategy (Hybrid)
- Admin Role Management (JWT Claims)
- Ingestion API Pattern (REST)

**Important Decisions (Shape Architecture):**
- Deno Runtime Version (2.1 Compatible)

**Deferred Decisions (Post-MVP):**
- ElasticSearch (Using Postgres FTS instead)
- Complex Notification System (Using Basic Email/UI only)

### Data Architecture

**Decision:** Hybrid Data Model (Typed Columns + JSONB)
**Rationale:** Critical fields (Title, Amount, Status, SourceType) must be top-level columns for efficient indexing, sorting, and RLS filtering. The rest of the payload remains in JSONB for schema flexibility without migrations.
**Affects:** Database Schema, API Performance.

### Authentication & Security

**Decision:** Role Management via `app_metadata`
**Constraint:** Roles must be stored in `app_metadata` (not `user_metadata`) to be protected from user self-update.
**Rationale:** Allows RLS policies to check `auth.jwt() ->> 'app_metadata' ->> 'role'` without performing a join on a separate `profiles` table, maximizing performance.
**Affects:** Auth Flow, RLS Policies.

### API & Communication Patterns

**Decision:** REST API for Ingestion (Edge Functions)
**Rationale:** Allows external scripts (scrapers) and public APIs to push data via standard HTTP POST without needing the Supabase SDK or specific RPC knowledge.
**Affects:** Edge Functions Implementation.

### Infrastructure & Deployment

**Decision:** Deno 2.1 Compatible Runtime
**Constraint:** Functions must be compatible with Deno 2.1 features but not strictly pinned to a patch version to allow Supabase platform updates.
**Rationale:** Leveraging latest performance improvements and standard library features of Deno while maintaining platform compatibility.
**Affects:** Edge Functions Development.

### Decision Impact Analysis

**Implementation Sequence:**
1.  Initialize Starter & Customize UI.
2.  Design DB Schema (Hybrid) & RLS (JWT-based).
3.  Implement Auth Flow (Admin Role logic).
4.  Develop Ingestion Edge Function (REST).
5.  Build Admin Dashboard.

**Cross-Component Dependencies:**
- The Hybrid Data Model dictates the TypeScript types generated for the Frontend.
- The `app_metadata` decision requires a secure Admin function to promote users (since users can't edit `app_metadata`).

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:**
5 areas where AI agents could make different choices

### Naming Patterns

**Database Naming Conventions:**
- Tables: `snake_case`, plural (e.g., `scholarships`, `validation_events`).
- Columns: `snake_case` (e.g., `is_published`, `created_at`).
- Enums: `SCREAMING_SNAKE_CASE` values (e.g., `PENDING`, `NEEDS_REVIEW`).

**API Naming Conventions:**
- Edge Functions: `kebab-case` folder names (e.g., `supabase/functions/ingest-scholarship`).
- REST: Standard HTTP verbs + JSON payload.

**Code Naming Conventions:**
- TypeScript Variables/Functions: `camelCase`.
- React Components: `PascalCase`.
- Files: `kebab-case`.

### Structure Patterns

**Project Organization:**
- **Monorepo Structure:**
  - `/src`: Frontend App (React/Vite).
  - `/supabase`: Backend Config (Migrations, Functions, Config).
  - `/scripts`: Utility scripts (e.g., scraper prototypes).

**File Structure Patterns:**
- **Feature-Based Frontend:**
  - `src/features/scholarships/components/`
  - `src/features/scholarships/hooks/`
  - `src/features/scholarships/mappers/` (Critical: DB snake_case -> TS camelCase mapping).

### Format Patterns

**API Response Formats:**
- Success: `{ "data": { ... }, "error": null }`
- Error: `{ "data": null, "error": { "code": "ERR_CODE", "message": "Human readable" } }`

**Data Exchange Formats:**
- **Strict DB<->App Boundary:** All DB access MUST pass through a mapper layer. No raw `snake_case` props leaking into React components.

### Communication Patterns

**Event System Patterns:**
- **Audit Logging:** Every critical action (create/update/delete/publish) MUST trigger a log insert to `validation_events` with `correlation_id`, `actor_id`, `actor_role`, `action`, `entity_id`.

**State Management Patterns:**
- React Query (TanStack Query) for server state (Supabase data).
- Zustand/Context for local UI state (filters, session).

### Process Patterns

**Error Handling Patterns:**
- **Frontend:** User-friendly Toasts (Shadcn) for validation errors.
- **Backend:** `try/catch` block wrapping main logic, returning standard JSON error.

**Loading State Patterns:**
- Skeletons (Shadcn) for initial load.
- Disabled buttons with spinner for mutations.

### Enforcement Guidelines

**All AI Agents MUST:**
- Use the **Mapper Layer** for all data fetching to convert `snake_case` (DB) to `camelCase` (App).
- Define Enums in **Supabase DB** first, then generate TypeScript types. **No hardcoded strings** in frontend logic.
- Verify **RLS Policies** for every data access pattern. Never rely on frontend hiding for security.
- Use **Edge Functions ONLY** for Ingestion, Scoring, and Revalidation. Use standard Supabase Client for CRUD.

**Pattern Enforcement:**
- TypeScript Compiler (Strict)
- Database Constraints (Enums, RLS)
- Code Review Checklist (Mappers, RLS, Logs)

### Pattern Examples

**Good Examples:**
- `const { data } = await supabase.from('scholarships').select('*')` -> `const scholarship = mapScholarshipToApp(data)`
- `enum ScholarshipStatus { PENDING = 'PENDING' }` (matches DB)

**Anti-Patterns:**
- Using `data.is_published` directly in JSX.
- Hardcoding `status === 'pending'` string checks.
- Creating an Edge Function for "Get Scholarship List" (Use Supabase Client instead).

## Project Structure & Boundaries

### Complete Project Directory Structure

```text
scholarship-builder/
├── .github/workflows/         # CI/CD (Lint, Test, Deploy)
├── supabase/
│   ├── functions/             # EDGE FUNCTIONS (Deno)
│   │   ├── ingest-scholarship/
│   │   ├── check-freshness/
│   │   └── _shared/           # Code partagé entre fonctions (Types DB, Utils)
│   ├── migrations/            # SQL Migrations (Schema, RLS, Enums)
│   ├── config.toml            # Config locale Supabase
│   └── seed.sql               # Données de test
├── src/                       # FRONTEND APP (React/Vite)
│   ├── components/            # Composants partagés
│   │   ├── ui/                # Shadcn UI (Atomic)
│   │   └── layout/            # Shell, Sidebar, Navbar
│   ├── features/              # FEATURE MODULES (Bounded Contexts)
│   │   ├── auth/              # Login, Logout, Guards
│   │   ├── scholarships/      # Liste, Détail, Soumission
│   │   │   ├── components/
│   │   │   ├── hooks/         # React Query hooks
│   │   │   └── mappers.ts     # DB -> App mapping
│   │   └── admin/             # Backoffice Validation
│   ├── lib/
│   │   ├── supabase.ts        # Client Supabase Singleton
│   │   └── utils.ts           # Helpers (cn, dates)
│   ├── pages/                 # Routes (File-based ou Config)
│   └── App.tsx
├── public/                    # Assets statiques
├── scripts/                   # Scripts utilitaires (Node.js)
│   └── scraper-prototype.js
├── .env.example
├── package.json               # Deps Frontend
├── tsconfig.json              # Config TS Frontend
├── deno.json                  # Config Deno (Workspace pour Edge Functions)
└── vite.config.ts
```

### Architectural Boundaries

**API Boundaries:**
- **External Ingestion:** `POST /functions/v1/ingest-scholarship` (REST, Public but secured by Anon Key + Size Limit).
- **Frontend Data Access:** Supabase Client (PostgREST) calls to `https://<project>.supabase.co/rest/v1`.

**Component Boundaries:**
- **Features are isolated:** `scholarships` feature should not import directly from `admin` feature. Use shared `lib` or events if needed.
- **UI is dumb:** `components/ui` knows nothing about business logic or Supabase.

**Service Boundaries:**
- **Edge Functions:** Independent, stateless units. Do not share state. Use DB for coordination.
- **Frontend:** Single Page App. Client-side routing.

**Data Boundaries:**
- **Raw Data:** Locked in Storage Buckets.
- **Staged/Final Data:** Locked in Postgres Tables.
- **Access Control:** Enforced strictly by RLS Policies, never by API middleware.

### Requirements to Structure Mapping

**Feature/Epic Mapping:**
- **Identity & Access:** `src/features/auth/`, `supabase/migrations/*_auth_rls.sql`
- **Core Data Pipeline:** `supabase/functions/ingest-scholarship/`, `supabase/migrations/*_raw_staged_tables.sql`
- **Trust Center:** `src/features/admin/`, `src/features/scholarships/`
- **Freshness Loop:** `supabase/functions/check-freshness/`, `supabase/extensions/pg_cron.sql`

**Cross-Cutting Concerns:**
- **Traceability:** `supabase/migrations/*_audit_trigger.sql`

### Integration Points

**Internal Communication:**
- **React <-> Supabase:** `@supabase/supabase-js` client.
- **Edge Function <-> DB:** `deno-postgres` or Supabase Client (Deno version).

**External Integrations:**
- **Scraper <-> Ingestion:** HTTP POST to Edge Function URL.

**Data Flow:**
- Ingest -> Storage + Queue -> Staged Table -> (Admin Review) -> Final Table.

### File Organization Patterns

**Configuration Files:**
- Frontend: `vite.config.ts`, `tailwind.config.js` in root.
- Backend: `supabase/config.toml`.

**Source Organization:**
- Feature-first. All related code (hooks, ui, types, api) lives in `src/features/<name>`.

**Test Organization:**
- Co-located tests: `ScholarshipCard.test.tsx` next to `ScholarshipCard.tsx`.
- Integration tests: `tests/integration/ingest.test.ts`.

**Asset Organization:**
- Public static assets in `/public`.

### Development Workflow Integration

**Development Server Structure:**
- `npm run dev`: Starts Vite dev server.
- `supabase start`: Starts local Supabase stack (DB, Auth, Functions, Storage).

**Build Process Structure:**
- `npm run build`: Compiles React app to `dist/`.
- `supabase functions deploy`: Deploys Edge Functions to global network.

**Deployment Structure:**
- Frontend -> Vercel (connected to GitHub).
- Backend -> Supabase Platform (linked via CLI).

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
Toutes les décisions (Deno 2.1, RLS basées sur JWT, Modèle Hybride) sont compatibles avec Supabase et permettent de rester dans le Free Tier.

**Pattern Consistency:**
L'utilisation systématique de Mappers garantit que la DB (snake_case) et l'UI (camelCase) ne se polluent pas mutuellement.

**Structure Alignment:**
La structure Monorepo avec distinction claire entre `/src` (Node/Vite) et `/supabase` (Deno) évite les conflits de runtime.

### Requirements Coverage Validation ✅

**Epic/Feature Coverage:**
Toutes les epics du PRD (Ingestion, Validation, Freshness) ont un ancrage structurel précis.

**Functional Requirements Coverage:**
L'ingestion asynchrone est gérée par les Edge Functions REST, la validation par l'app React et la fraîcheur par pg_cron.

**Non-Functional Requirements Coverage:**
- Sécurité : RLS gérées en DB.
- Traçabilité : Triggers d'audit sur les tables.
- Performance : App-metadata claims pour éviter les jointures auth.

### Implementation Readiness Validation ✅

**Decision Completeness:**
Les décisions critiques (Modeling, Auth, API) sont figer et documentées.

**Structure Completeness:**
L'arborescence complète du projet est définie.

**Pattern Completeness:**
Les conventions de nommage et les règles d'enforcement pour les agents IA sont explicites.

### Gap Analysis Results

**Critical Gaps:** None identified.
**Important Gaps:** Monitoring (Free tier Supabase logs limited).
**Nice-to-Have Gaps:** E2E tests for ingestion flow.

### Validation Issues Addressed

None. Architecture is coherent.

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped

**✅ Architectural Decisions**
- [x] Critical decisions documented with versions
- [x] Technology stack fully specified
- [x] Integration patterns defined
- [x] Performance considerations addressed

**✅ Implementation Patterns**
- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Communication patterns specified
- [x] Process patterns documented

**✅ Project Structure**
- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** High

**Key Strengths:**
Isolation claire des domaines, performance optimisée pour le Free Tier (JWT claims, Hybrid model), traçabilité native.

**Areas for Future Enhancement:**
Dashboard analytique des erreurs de scraping.

### Implementation Handoff

**AI Agent Guidelines:**
- Follow all architectural decisions exactly as documented.
- Use implementation patterns consistently across all components.
- Respect project structure and boundaries.
- Refer to this document for all architectural questions.

**First Implementation Priority:**
Initialize project structure:
```bash
git clone https://github.com/chunxchun/erp-starter.git .
```
Puis mise en place de la configuration Supabase et des migrations de base.

## Architecture Completion Summary

### Workflow Completion

**Architecture Decision Workflow:** COMPLETED ✅
**Total Steps Completed:** 8
**Date Completed:** 2026-01-30
**Document Location:** BMAD_OUTPUT/planning-artifacts/architecture.md

### Final Architecture Deliverables

**📋 Complete Architecture Document**
- All architectural decisions documented with specific versions
- Implementation patterns ensuring AI agent consistency
- Complete project structure with all files and directories
- Requirements to architecture mapping
- Validation confirming coherence and completeness

**🏗️ Implementation Ready Foundation**
- 5 architectural decisions made
- 6 implementation patterns defined
- 6 architectural components specified
- 7 requirements fully supported

**📚 AI Agent Implementation Guide**
- Technology stack with verified versions
- Consistency rules that prevent implementation conflicts
- Project structure with clear boundaries
- Integration patterns and communication standards

### Implementation Handoff

**For AI Agents:**
This architecture document is your complete guide for implementing ApiBuilderArchitecture. Follow all decisions, patterns, and structures exactly as documented.

**First Implementation Priority:**
git clone https://github.com/chunxchun/erp-starter.git .

**Development Sequence:**
1. Initialize project using documented starter template
2. Set up development environment per architecture
3. Implement core architectural foundations
4. Build features following established patterns
5. Maintain consistency with documented rules

### Quality Assurance Checklist

**✅ Architecture Coherence**
- [x] All decisions work together without conflicts
- [x] Technology choices are compatible
- [x] Patterns support the architectural decisions
- [x] Structure aligns with all choices

**✅ Requirements Coverage**
- [x] All functional requirements are supported
- [x] All non-functional requirements are addressed
- [x] Cross-cutting concerns are handled
- [x] Integration points are defined

**✅ Implementation Readiness**
- [x] Decisions are specific and actionable
- [x] Patterns prevent agent conflicts
- [x] Structure is complete and unambiguous
- [x] Examples are provided for clarity

### Project Success Factors

**🎯 Clear Decision Framework**
Every technology choice was made collaboratively with clear rationale, ensuring all stakeholders understand the architectural direction.

**🔧 Consistency Guarantee**
Implementation patterns and rules ensure that multiple AI agents will produce compatible, consistent code that works together seamlessly.

**📋 Complete Coverage**
All project requirements are architecturally supported, with clear mapping from business needs to technical implementation.

**🏗️ Solid Foundation**
The chosen starter template and architectural patterns provide a production-ready foundation following current best practices.

---

**Architecture Status:** READY FOR IMPLEMENTATION ✅

**Next Phase:** Begin implementation using the architectural decisions and patterns documented herein.

**Document Maintenance:** Update this architecture when major technical decisions are made during implementation.