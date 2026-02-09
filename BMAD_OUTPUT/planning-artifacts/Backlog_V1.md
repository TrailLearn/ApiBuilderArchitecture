---
stepsCompleted: [1, 2, 3, 4]
inputDocuments: ['BMAD_OUTPUT/planning-artifacts/PRD_V1.md', 'BMAD_OUTPUT/planning-artifacts/architecture.md']
---

# ApiBuilderArchitecture - Epic Breakdown (Backlog V1)

## Overview

This document provides the complete epic and story breakdown for ApiBuilderArchitecture, decomposing the requirements from the PRD and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: Ingestion asynchrone multi-sources (User, API, Scraping)
FR2: Stockage immuable des données brutes (Raw Storage)
FR3: Normalisation et stockage en base de données (Staging -> Final)
FR4: Workflow de validation Admin (Pending -> Review -> Approved -> Rejected)
FR5: Exposition publique des données validées (API/UI Anonymous Read)
FR6: Boucle de revalidation annuelle automatique (Freshness Loop)
FR7: Gestion sécurisée des rôles (Admin, User, Anonymous) via RLS et Supabase Auth
FR8: Soumission de bourses par les utilisateurs authentifiés (User Contribution)
FR9: Tableau de bord Admin pour la gestion des bourses (Listing, Validation, Rejet)

### Non-Functional Requirements

NFR1: Coût Zéro - Doit fonctionner entièrement sur le Free Tier Supabase
NFR2: Architecture 100% Serverless (Edge Functions, Static Frontend)
NFR3: Traçabilité totale - Audit logs de la source à la publication
NFR4: Qualité des données - 0% de liens morts, fraîcheur < 1 an
NFR5: Performance - Optimisation des rôles via `app_metadata` pour éviter les jointures coûteuses
NFR6: Sécurité - Sécurité gérée nativement par RLS (Row Level Security)

### Additional Requirements

AR1: Utilisation du starter template `chunxchun/erp-starter` (Vite, React, TS, Tailwind, Shadcn UI)
AR2: Modèle de données Hybride (Colonnes typées pour l'indexation + JSONB pour la flexibilité)
AR3: Authentification via Supabase Auth avec rôles dans `app_metadata` (pas dans `user_metadata`)
AR4: Pattern API REST pour l'ingestion via Edge Functions
AR5: Runtime Deno 2.1 Compatible pour les Edge Functions
AR6: Structure Monorepo avec frontières strictes (Frontend / Supabase)
AR7: Utilisation obligatoire d'une couche Mapper pour la conversion snake_case (DB) <-> camelCase (App)
AR8: Gestion des logs d'audit via Triggers SQL vers table `validation_events`
AR9: Gestion des états UI avec React Query (Server) et Zustand (Client)

### FR Coverage Map

FR1: Epic 2 - Core Data Pipeline (Ingestion multi-sources)
FR2: Epic 2 - Core Data Pipeline (Stockage Raw)
FR3: Epic 2 - Core Data Pipeline (Normalisation)
FR4: Epic 3 - Trust Center (Validation Workflow)
FR5: Epic 4 - Public Catalog (Exposition publique)
FR6: Epic 6 - Freshness Loop (Revalidation)
FR7: Epic 1 - Identity & Access (Auth & RLS)
FR8: Epic 5 - User Contribution (Soumission User)
FR9: Epic 3 - Trust Center (Admin Dashboard)

## Epic List

### Epic 1: Identity & Access (Auth & RLS)
Gérer l'authentification sécurisée et l'attribution des rôles (Admin, User, Anon) pour garantir que chaque utilisateur accède uniquement aux données autorisées.
**FRs covered:** FR7, NFR6, NFR5, AR1, AR3

### Epic 2: Core Data Pipeline (Ingest & Store)
Mettre en place le pipeline d'ingestion asynchrone multi-sources et le stockage normalisé pour centraliser toutes les opportunités de bourses.
**FRs covered:** FR1, FR2, FR3, NFR2, AR4

### Epic 3: Trust Center (Admin Validation)
Fournir aux administrateurs les outils pour valider, rejeter et publier les bourses, garantissant ainsi la qualité et la confiance du catalogue.
**FRs covered:** FR4, FR9, NFR3, NFR4

### Epic 4: Public Catalog (Display)
Permettre aux utilisateurs anonymes de consulter le catalogue des bourses validées via une interface publique performante.
**FRs covered:** FR5, NFR1

### Epic 5: User Contribution (Submit)
Permettre aux utilisateurs authentifiés de soumettre de nouvelles bourses pour enrichir le catalogue de manière collaborative.
**FRs covered:** FR8

### Epic 6: Freshness Loop (Maintenance)
Automatiser la vérification périodique de la validité des liens pour assurer que le catalogue reste à jour sans intervention manuelle constante.
**FRs covered:** FR6, NFR4

### Epic 7: Traceability & Audit (System Integrity)
Assurer que toutes les actions critiques (changements d'état, publications) sont logguées de manière immuable pour l'audit et le débogage.
**FRs covered:** NFR3, AR8

## Epic 1: Identity & Access (Auth & RLS)

### Story 1.1: Initial Project Setup (Starter Template)

As a Developer,
I want to initialize the project using the erp-starter template and connect it to my online Supabase project,
So that I have a production-ready foundation connected to the cloud infrastructure.

**Acceptance Criteria:**

**Given** the project architecture requirements and an existing Supabase project
**When** I clone `https://github.com/chunxchun/erp-starter.git` and install dependencies
**Then** the project structure is created with Vite, React, and Supabase client
**And** I create a `.env` file with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from the Supabase Dashboard
**And** the development server starts and successfully connects to the remote database

### Story 1.2: Setup Auth & Public Access (Anon)

As a Anonymous User,
I want to be able to access public data without logging in,
So that I can view scholarships immediately.

**Acceptance Criteria:**

**Given** the Supabase project is initialized
**When** an unauthenticated user queries the 'scholarships' table
**Then** they should receive only records where status is 'PUBLISHED'
**And** they should NOT be able to insert, update, or delete any records

### Story 1.3: User Signup & Login

As a Contributor User,
I want to sign up and log in to the platform,
So that I can submit scholarships and track my contributions.

**Acceptance Criteria:**

**Given** a visitor on the login page
**When** they enter valid credentials (email/password) or use a social provider
**Then** a new user account is created in Supabase Auth
**And** they receive a valid JWT session
**And** the 'authenticated' RLS role is applied to their session

### Story 1.4: Admin Role Management (JWT Claims)

As a System Administrator,
I want a secure way to assign Admin roles that users cannot tamper with,
So that I can protect sensitive administrative functions.

**Acceptance Criteria:**

**Given** a user needs admin privileges
**When** the system administrator runs the 'set_admin_role' secure database function
**Then** the target user's `app_metadata` is updated with `role: 'admin'`
**And** RLS policies granting full access to 'admin' role become active for that user
**And** standard users cannot modify their own `app_metadata`

## Epic 2: Core Data Pipeline (Ingest & Store)

Mettre en place le pipeline d'ingestion asynchrone multi-sources et le stockage normalisé pour centraliser toutes les opportunités de bourses.

### Story 2.1: Raw Data Storage Schema

As a System Architect,
I want a dedicated raw storage table,
So that I can keep an immutable record of all incoming data before processing.

**Acceptance Criteria:**

**Given** the database schema setup
**When** the migration is applied
**Then** a `raw_scholarships` table exists with `source_id`, `payload` (JSONB), and `ingestion_status` columns
**And** RLS policies prevent public read access to this table
**And** RLS policies allow the Service Role (Edge Functions) to insert records

### Story 2.2: Ingestion Edge Function (REST API)

As an External Data Provider (Scraper/API),
I want a standard REST endpoint to push scholarship data,
So that I can send data without needing direct database access.

**Acceptance Criteria:**

**Given** a valid API key or signed JWT
**When** a POST request is sent to `/functions/v1/ingest-scholarship` with a JSON payload
**Then** the function validates the payload size
**And** inserts the record into `raw_scholarships` with status 'PENDING'
**And** returns a 201 Created response with the new record ID

### Story 2.3: Normalization Trigger (Raw -> Staged)

As a System,
I want to automatically process raw data into a structured format,
So that it becomes available for validation without manual intervention.

**Acceptance Criteria:**

**Given** a new record is inserted into `raw_scholarships`
**When** the database trigger fires
**Then** the JSONB payload is parsed to extract key fields (title, amount, url)
**And** a new record is inserted into the `scholarships` table with status 'PENDING_REVIEW'
**And** the `raw_scholarships` record status is updated to 'PROCESSED'
**And** basic de-duplication checks prevents creating duplicates if the source URL already exists

## Epic 3: Trust Center (Admin Validation)

Fournir aux administrateurs les outils pour valider, rejeter et publier les bourses, garantissant ainsi la qualité et la confiance du catalogue.

### Story 3.1: Admin Dashboard & List View

As an Administrator,
I want to see a list of all scholarships waiting for review,
So that I can prioritize my validation work.

**Acceptance Criteria:**

**Given** I am logged in with an 'admin' role
**When** I visit the `/admin` dashboard route
**Then** I should see a table of scholarships with status 'PENDING_REVIEW'
**And** I should see columns for Title, Source, Date, and Status
**And** users without 'admin' role should be redirected or see a 403 Forbidden error

### Story 3.2: Review & Edit Interface

As an Administrator,
I want to edit the details of a scholarship draft,
So that I can correct typos or formatting issues before publication.

**Acceptance Criteria:**

**Given** I am viewing a pending scholarship
**When** I edit the form fields (Title, Amount, Description) and click 'Save Draft'
**Then** the record in the `scholarships` table is updated
**And** the status remains 'PENDING_REVIEW'
**And** the changes are persisted for the next review step

### Story 3.3: Approve & Publish Workflow

As an Administrator,
I want to officially publish a validated scholarship,
So that it becomes visible to the public.

**Acceptance Criteria:**

**Given** I have reviewed a scholarship and verified its details
**When** I click the 'Approve & Publish' button
**Then** the scholarship status is updated to 'PUBLISHED'
**And** it immediately becomes visible to the public API
**And** an audit log event is recorded for this action

### Story 3.4: Rejection Workflow

As an Administrator,
I want to reject invalid or spam submissions,
So that they do not pollute the database or public view.

**Acceptance Criteria:**

**Given** I identify a scholarship as spam or duplicate
**When** I click the 'Reject' button
**Then** the scholarship status is updated to 'REJECTED'
**And** it is hidden from the main review queue
**And** it is NEVER shown to the public

## Epic 4: Public Catalog (Display)

Permettre aux utilisateurs anonymes de consulter le catalogue des bourses validées via une interface publique performante.

### Story 4.1: Public List API & UI

As a Visitor,
I want to browse the list of available scholarships,
So that I can see what opportunities exist.

**Acceptance Criteria:**

**Given** the public landing page
**When** the page loads
**Then** it fetches a list of scholarships from Supabase
**And** only records with status 'PUBLISHED' are returned (enforced by RLS)
**And** the list displays key information (Title, Amount, Deadline) in a responsive grid

### Story 4.2: Scholarship Detail Page

As a Visitor,
I want to view the full details of a specific scholarship,
So that I can decide if I want to apply.

**Acceptance Criteria:**

**Given** I click on a scholarship card
**When** I am navigated to `/scholarship/:id`
**Then** all public details of the scholarship are displayed
**And** if the ID is invalid or the status is not PUBLISHED, a 404 error is shown
**And** a link to the original source URL is clearly visible

### Story 4.3: Search & Filters

As a Visitor,
I want to filter scholarships by criteria,
So that I can find ones relevant to me.

**Acceptance Criteria:**

**Given** the scholarship list view
**When** I enter a search term or select a filter (e.g., Amount > 1000)
**Then** the list updates to show only matching records
**And** the filtering happens efficiently using Supabase query parameters

## Epic 5: User Contribution (Submit)

Permettre aux utilisateurs authentifiés de soumettre de nouvelles bourses pour enrichir le catalogue de manière collaborative.

### Story 5.1: Submission Form

As a Contributor,
I want a form to submit a new scholarship,
So that I can share an opportunity I found.

**Acceptance Criteria:**

**Given** I am a logged-in user
**When** I fill out the submission form (Title, URL, Amount, Description) and submit
**Then** the data is sent to the ingestion API (reusing Epic 2 logic)
**And** I see a success message indicating it is pending review
**And** the system records my User ID as the submitter

### Story 5.2: My Submissions View

As a Contributor,
I want to see the status of scholarships I submitted,
So that I know if they have been approved or rejected.

**Acceptance Criteria:**

**Given** I am on the 'My Submissions' page
**When** the page loads
**Then** I see a list of scholarships where `submitter_id` matches my ID
**And** I can see their current status (Pending, Published, Rejected)

## Epic 6: Freshness Loop (Maintenance)

### Story 6.1: Check Freshness Edge Function

As a System,
I want an automated function to check the source URL status,
So that I can identify broken links or expired scholarships.

**Acceptance Criteria:**

**Given** a published scholarship ID
**When** the 'check-freshness' Edge Function is invoked
**Then** it performs an HTTP HEAD/GET request to the source URL
**And** if the status is not 200 OK, it updates the scholarship status to 'NEEDS_REVIEW'
**And** it updates the `last_checked_at` timestamp

### Story 6.2: Cron Job Setup

As a System,
I want to schedule the freshness check periodically,
So that the catalog maintenance requires no manual effort.

**Acceptance Criteria:**

**Given** the Supabase project configuration
**When** the `pg_cron` schedule is defined (e.g., daily at 2 AM)
**Then** it triggers the 'check-freshness' function for all scholarships older than 6 months
**And** it reports the number of processed and updated records in the function logs

## Epic 7: Traceability & Audit (System Integrity)

### Story 7.1: Audit Log Trigger (Database Level)

As a Compliance Officer,
I want every status change to be automatically recorded,
So that there is an immutable trail of who did what and when.

**Acceptance Criteria:**

**Given** the `scholarships` table
**When** a record's `status` column is updated
**Then** a database trigger automatically inserts a record into the `validation_events` table
**And** the log includes `scholarship_id`, `old_status`, `new_status`, `actor_id` (from JWT), and `timestamp`
**And** these logs are read-only for all users except the system service role

### Story 7.2: Admin Audit View (UI)

As an Administrator,
I want to see the history of a scholarship,
So that I can understand the decisions made by other admins.

**Acceptance Criteria:**

**Given** I am on the admin detail view of a scholarship
**When** I scroll to the 'History' or 'Audit' section
**Then** I see a chronological list of all status changes
**And** each entry shows the date, the actor name (or ID), and the status transition
