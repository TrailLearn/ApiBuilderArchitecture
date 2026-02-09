---
id: "3.4"
epic: "Trust Center (Admin Validation)"
status: "todo"
---

# Story 3.4: Rejection Workflow

As an Administrator,
I want to reject invalid or spam submissions,
So that they do not pollute the database or public view.

**Acceptance Criteria:**

**Given** I identify a scholarship as spam or duplicate
**When** I click the 'Reject' button
**Then** the scholarship status is updated to 'REJECTED'
**And** it is hidden from the main review queue
**And** it is NEVER shown to the public