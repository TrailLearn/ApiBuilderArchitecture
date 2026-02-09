---
project_name: 'ApiBuilderArchitecture'
user_name: 'aubinaso'
date: '2026-01-30'
sections_completed: ['technology_stack', 'language_rules', 'framework_rules', 'testing_rules', 'quality_rules', 'deployment_rules', 'critical_rules']
status: 'complete'
rule_count: 24
optimized_for_llm: true
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

*   **Frontend:** React 19 (Vite), TypeScript, Tailwind CSS, Shadcn UI.
*   **Backend:** Supabase (PostgreSQL), Edge Functions (Deno 2.1 Compatible).
*   **State Management:** TanStack Query (v5+), Zustand (UI state).
*   **Security:** Supabase Auth (app_metadata roles), PostgreSQL RLS.

---

## Critical Implementation Rules

### Language-Specific Rules

*   **TypeScript Strict Mode:** Mandatory. Use `unknown` over `any`.
*   **Data Mapping:** Every DB response MUST be mapped from `snake_case` to `camelCase` in the feature's `mappers.ts` before reaching components. No leakage of DB field names into JSX.
*   **Deno Runtime (Backend):** Use explicit versioned imports for Deno modules. Ensure compatibility with Deno 2.1 features.
*   **Async Patterns:** Use `async/await` exclusively. Avoid `.then()` chains.

### Framework-Specific Rules

*   **React State Management:** Use TanStack Query for all server-side state. Use Zustand for light global UI state. No `useEffect` for data fetching.
*   **Component Architecture:** Follow Shadcn UI patterns. Keep business logic in custom hooks (`/hooks`) and UI in functional components.
*   **Supabase Client:** Use the shared singleton from `@lib/supabase`. Never instantiate multiple clients.
*   **Auth & Roles:** Always check `app_metadata` for roles. Access via `auth.jwt() ->> 'app_metadata' ->> 'role'`.

### Testing Rules

*   **Front-end Testing:** Use Vitest and React Testing Library. Co-locate unit tests with components (`*.test.tsx`).
*   **Edge Functions Testing:** Use native `deno test`. Mock external API calls (scraping targets).
*   **Mocks:** Use MSW (Mock Service Worker) for intercepting Supabase calls in frontend tests.
*   **Security Testing:** Mandatory integration tests verifying RLS policies against Anon, User, and Admin roles.

### Code Quality & Style Rules

*   **Linting & Formatting:** ESLint + Prettier mandatory. Pre-commit hooks enforce these.
*   **ADR Index:** All major technical shifts MUST be documented as Architecture Decision Records in `docs/adr/`.
*   **Naming Consistency:** `PascalCase` for Components, `camelCase` for variables/functions, and `kebab-case` for files.
*   **Enums:** Defined in Supabase DB first, then mirrored in TS. No hardcoded strings for statuses.

### Deployment & Maintenance (Single Source of Truth)

*   **DEPLOYMENT.md:** A single, living document at the root of the repo. Absolute reference for local setup and production.
*   **Update Rule:** Any PR affecting infrastructure, env vars, or deploy steps MUST update `DEPLOYMENT.md`.
*   **References:** README.md and CONTRIBUTING.md must link explicitly to this file.

### Critical Don't-Miss Rules (Anti-Patterns)

*   **Security by UI:** Never rely on "hiding buttons". Security MUST be enforced by RLS.
*   **CRUD via Edge Functions:** Prohibited for standard operations. Use Supabase Client directly. Edge Functions are for Ingestion, Scoring, and Revalidation ONLY.
*   **Batching:** Mass operations (Freshness check) MUST be batched to respect the 10s Edge Function timeout (Free Tier).
*   **Audit Logging:** Every critical action MUST trigger an insert to `validation_events` with full traceability metadata.

---

## Usage Guidelines

**For AI Agents:**
*   Read this file before implementing any code.
*   Follow ALL rules exactly as documented.
*   When in doubt, prefer the more restrictive option.
*   Update this file if new patterns emerge.

**For Humans:**
*   Keep this file lean and focused on agent needs.
*   Update when technology stack changes.
*   Review quarterly for outdated rules.

Last Updated: 2026-01-30
