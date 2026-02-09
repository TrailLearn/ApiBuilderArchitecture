---
id: "2.2"
epic: "Core Data Pipeline (Ingest & Store)"
status: "todo"
---

# Story 2.2: Ingestion Edge Function (REST API)

As an External Data Provider (Scraper/API),
I want a standard REST endpoint to push scholarship data,
So that I can send data without needing direct database access.

**Acceptance Criteria:**

**Given** a valid API key or signed JWT
**When** a POST request is sent to `/functions/v1/ingest-scholarship` with a JSON payload
**Then** the function validates the payload size
**And** inserts the record into `raw_scholarships` with status 'PENDING'
**And** returns a 201 Created response with the new record ID