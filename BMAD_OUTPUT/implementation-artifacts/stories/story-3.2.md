---
id: "3.2"
epic: "Trust Center (Admin Validation)"
status: "todo"
---

# Story 3.2: Review & Edit Interface

As an Administrator,
I want to edit the details of a scholarship draft,
So that I can correct typos or formatting issues before publication.

**Acceptance Criteria:**

**Given** I am viewing a pending scholarship
**When** I edit the form fields (Title, Amount, Description) and click 'Save Draft'
**Then** the record in the `scholarships` table is updated
**And** the status remains 'PENDING_REVIEW'
**And** the changes are persisted for the next review step