---
id: "1.2"
epic: "Identity & Access (Auth & RLS)"
status: "todo"
---

# Story 1.2: Setup Auth & Public Access (Anon)

As a Anonymous User,
I want to be able to access public data without logging in,
So that I can view scholarships immediately.

**Acceptance Criteria:**

**Given** the Supabase project is initialized
**When** an unauthenticated user queries the 'scholarships' table
**Then** they should receive only records where status is 'PUBLISHED'
**And** they should NOT be able to insert, update, or delete any records