---
id: "4.1"
epic: "Public Catalog (Display)"
status: "todo"
---

# Story 4.1: Public List API & UI

As a Visitor,
I want to browse the list of available scholarships,
So that I can see what opportunities exist.

**Acceptance Criteria:**

**Given** the public landing page
**When** the page loads
**Then** it fetches a list of scholarships from Supabase
**And** only records with status 'PUBLISHED' are returned (enforced by RLS)
**And** the list displays key information (Title, Amount, Deadline) in a responsive grid