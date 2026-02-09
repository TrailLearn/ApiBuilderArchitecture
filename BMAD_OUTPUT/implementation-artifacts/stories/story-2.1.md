---
id: "2.1"
epic: "Core Data Pipeline (Ingest & Store)"
status: "todo"
---

# Story 2.1: Raw Data Storage Schema

As a System Architect,
I want a dedicated raw storage table,
So that I can keep an immutable record of all incoming data before processing.

**Acceptance Criteria:**

**Given** the database schema setup
**When** the migration is applied
**Then** a `raw_scholarships` table exists with `source_id`, `payload` (JSONB), and `ingestion_status` columns
**And** RLS policies prevent public read access to this table
**And** RLS policies allow the Service Role (Edge Functions) to insert records