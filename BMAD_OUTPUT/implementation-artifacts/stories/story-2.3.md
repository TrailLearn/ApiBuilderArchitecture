---
id: "2.3"
epic: "Core Data Pipeline (Ingest & Store)"
status: "todo"
---

# Story 2.3: Normalization Trigger (Raw -> Staged)

As a System,
I want to automatically process raw data into a structured format,
So that it becomes available for validation without manual intervention.

**Acceptance Criteria:**

**Given** a new record is inserted into `raw_scholarships`
**When** the database trigger fires
**Then** the JSONB payload is parsed to extract key fields (title, amount, url)
**And** a new record is inserted into the `scholarships` table with status 'PENDING_REVIEW'
**And** the `raw_scholarships` record status is updated to 'PROCESSED'
**And** basic de-duplication checks prevents creating duplicates if the source URL already exists