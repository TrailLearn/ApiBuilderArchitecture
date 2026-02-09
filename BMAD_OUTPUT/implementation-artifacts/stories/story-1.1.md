---
id: "1.1"
epic: "Identity & Access (Auth & RLS)"
status: "todo"
---

# Story 1.1: Initial Project Setup (Starter Template)

As a Developer,
I want to initialize the project using the erp-starter template and connect it to my online Supabase project,
So that I have a production-ready foundation connected to the cloud infrastructure.

**Acceptance Criteria:**

**Given** the project architecture requirements and an existing Supabase project
**When** I clone `https://github.com/chunxchun/erp-starter.git` and install dependencies
**Then** the project structure is created with Vite, React, and Supabase client
**And** I create a `.env` file with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from the Supabase Dashboard
**And** the development server starts and successfully connects to the remote database