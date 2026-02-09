# Story 2.3: Normalization Trigger (Raw -> Staged)

Status: done

## Story

As a System,
I want to automatically process raw data into a structured format,
so that it becomes available for validation without manual intervention.

## Acceptance Criteria

1. **Given** a new record is inserted into `raw_scholarships`
2. **When** the database trigger fires
3. **Then** the JSONB payload is parsed to extract key fields (title, amount, url)
4. **And** a new record is inserted into the `scholarships` table with status 'PENDING_REVIEW'
5. **And** the `raw_scholarships` record status is updated to 'PROCESSED'
6. **And** basic de-duplication checks prevents creating duplicates if the source URL already exists

## Tasks / Subtasks



- [x] Task 1: Trigger Function Logic (AC: 3, 4, 5, 6)

  - [x] Create SQL file `prisma/sql/process_scholarship.sql`

  - [x] Write PL/pgSQL function `process_new_scholarship()`

  - [x] Extract JSON fields: title, amount, url, description

  - [x] Check for existing URL in `scholarships` table

  - [x] Insert into `scholarships` if new

  - [x] Update `raw_scholarships.ingestion_status` to 'PROCESSED' (or 'ERROR' on failure)

- [x] Task 2: Trigger Definition (AC: 2)

  - [x] Add trigger definition to the SQL file

  - [x] `AFTER INSERT ON raw_scholarships FOR EACH ROW EXECUTE FUNCTION process_new_scholarship()`

- [x] Task 3: Local Testing (AC: 1)

  - [x] Create a script `scripts/test-trigger.js` that inserts into `raw_scholarships` directly (simulating edge function)   

  - [x] Verify data appears in `scholarships` table



## Dev Notes



- **Error Handling:** If insertion fails (e.g. invalid data), catch the exception in the trigger and set status to 'ERROR'.  

- **Idempotency:** If URL exists, maybe update the existing record or just skip? AC says "prevents creating duplicates", so s

kipping or updating status to 'DUPLICATE' in raw table is best. Let's mark raw as 'PROCESSED' but log it.



### Project Structure Notes



- SQL: `prisma/sql/process_scholarship.sql`



### References



- [Source: BMAD_OUTPUT/planning-artifacts/architecture.md #Data Architecture]

- [Source: BMAD_OUTPUT/planning-artifacts/epics.md #Story 2.3]



## Dev Agent Record



### Agent Model Used



Gemini 2.0 Flash



### Debug Log References



- Created PL/pgSQL function and trigger in `prisma/sql/process_scholarship.sql`.

- Implemented duplicate detection based on `source_url`.

- Created `scripts/test-trigger.js` to validate end-to-end flow.



### Completion Notes List







- Database trigger implemented to normalize raw data.



- Deduplication logic active.



- Error handling included in PL/pgSQL block.



- CR Fix: Trigger optimized to `BEFORE INSERT` for performance.



- CR Fix: Secured SQL function with `search_path`.



- CR Fix: Added `trim()` to extracted fields for better data quality.



### File List



- prisma/sql/process_scholarship.sql

- scripts/test-trigger.js
