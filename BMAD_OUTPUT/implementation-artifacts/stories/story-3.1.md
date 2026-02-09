---
id: "3.1"
epic: "Trust Center (Admin Validation)"
status: "todo"
---

# Story 3.1: Admin Dashboard & List View

As an Administrator,
I want to see a list of all scholarships waiting for review,
So that I can prioritize my validation work.

**Acceptance Criteria:**

**Given** I am logged in with an 'admin' role
**When** I visit the `/admin` dashboard route
**Then** I should see a table of scholarships with status 'PENDING_REVIEW'
**And** I should see columns for Title, Source, Date, and Status
**And** users without 'admin' role should be redirected or see a 403 Forbidden error