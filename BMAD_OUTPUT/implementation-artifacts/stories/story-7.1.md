---
id: "7.1"
epic: "Traceability & Audit (System Integrity)"
status: "todo"
---

# Story 7.1: Audit Log Trigger (Database Level)

As a Compliance Officer,
I want every status change to be automatically recorded,
So that there is an immutable trail of who did what and when.

**Acceptance Criteria:**

**Given** the `scholarships` table
**When** a record's `status` column is updated
**Then** a database trigger automatically inserts a record into the `validation_events` table
**And** the log includes `scholarship_id`, `old_status`, `new_status`, `actor_id` (from JWT), and `timestamp`
**And** these logs are read-only for all users except the system service role