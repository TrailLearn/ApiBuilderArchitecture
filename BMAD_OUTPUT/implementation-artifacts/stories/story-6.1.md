---
id: "6.1"
epic: "Freshness Loop (Maintenance)"
status: "todo"
---

# Story 6.1: Check Freshness Edge Function

As a System,
I want an automated function to check the source URL status,
So that I can identify broken links or expired scholarships.

**Acceptance Criteria:**

**Given** a published scholarship ID
**When** the 'check-freshness' Edge Function is invoked
**Then** it performs an HTTP HEAD/GET request to the source URL
**And** if the status is not 200 OK, it updates the scholarship status to 'NEEDS_REVIEW'
**And** it updates the `last_checked_at` timestamp