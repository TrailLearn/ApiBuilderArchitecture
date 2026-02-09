# Technical Documentation: Project Initialization

**Date:** 2026-02-09
**Project:** ApiBuilderArchitecture
**Status:** Initialized

## 1. Project Overview
The project is a Scholarships API Builder, designed to ingest, validate, and publish scholarship opportunities. It uses a serverless architecture based on Supabase and a React frontend.

## 2. Tech Stack
- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Shadcn UI.
- **Backend:** Supabase (Auth, Database, Edge Functions).
- **Testing:** Vitest for unit/smoke tests.
- **Package Manager:** npm (package-lock.json).

## 3. Architecture & Structure
Aligned with `architecture.md`, the project follows a monorepo-style structure:
- `/src`: Frontend source code.
  - `/features`: Domain-driven modules (Auth, Scholarships).
  - `/components/ui`: Atomic Shadcn components.
- `/supabase`: Backend configuration and migrations.
- `/BMAD_OUTPUT`: Planning and implementation artifacts.

## 4. Environment Configuration
Variables required in `.env`:
- `VITE_SUPABASE_URL`: Your Supabase Project URL.
- `VITE_SUPABASE_ANON_KEY`: Your Supabase Anonymous Key.

## 5. Verification
A smoke test is available in `src/supabaseClient.test.ts` to verify the connection to the Supabase client.
Run with: `npm test`
