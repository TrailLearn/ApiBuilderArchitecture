---
id: "6.2"
epic: "Freshness Loop (Maintenance)"
status: "todo"
---

# Story 6.2: Cron Job Setup

As a System,
I want to schedule the freshness check periodically,
So that the catalog maintenance requires no manual effort.

**Acceptance Criteria:**

**Given** the Supabase project configuration
**When** the `pg_cron` schedule is defined (e.g., daily at 2 AM)
**Then** it triggers the 'check-freshness' function for all scholarships older than 6 months
**And** it reports the number of processed and updated records in the function logs