---
id: "4.2"
epic: "Public Catalog (Display)"
status: "todo"
---

# Story 4.2: Scholarship Detail Page

As a Visitor,
I want to view the full details of a specific scholarship,
So that I can decide if I want to apply.

**Acceptance Criteria:**

**Given** I click on a scholarship card
**When** I am navigated to `/scholarship/:id`
**Then** all public details of the scholarship are displayed
**And** if the ID is invalid or the status is not PUBLISHED, a 404 error is shown
**And** a link to the original source URL is clearly visible