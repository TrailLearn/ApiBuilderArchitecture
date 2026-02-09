---
id: "5.1"
epic: "User Contribution (Submit)"
status: "todo"
---

# Story 5.1: Submission Form

As a Contributor,
I want a form to submit a new scholarship,
So that I can share an opportunity I found.

**Acceptance Criteria:**

**Given** I am a logged-in user
**When** I fill out the submission form (Title, URL, Amount, Description) and submit
**Then** the data is sent to the ingestion API (reusing Epic 2 logic)
**And** I see a success message indicating it is pending review
**And** the system records my User ID as the submitter