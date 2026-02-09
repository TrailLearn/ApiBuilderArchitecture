# Story 3.4: Rejection Workflow

Status: done

## Story

As an Administrator,
I want to reject invalid or spam submissions,
so that they do not pollute the database or public view.

## Acceptance Criteria

1. **Given** I identify a scholarship as spam or duplicate
2. **When** I click the 'Reject' button
3. **Then** the scholarship status is updated to 'REJECTED'
4. **And** it is hidden from the main review queue
5. **And** it is NEVER shown to the public

## Tasks / Subtasks

- [ ] Task 1: Rejection Logic (AC: 3)
  - [ ] Ensure `updateScholarship` supports 'REJECTED' status (already covered by Enum).
- [ ] Task 2: UI Implementation (AC: 2)
  - [ ] Add "Reject" button (destructive variant) to `ReviewScholarship.tsx`.
  - [ ] Add confirmation dialog (Critical for destructive actions).
  - [ ] Handle state transition to 'REJECTED'.
- [ ] Task 3: Verification (AC: 4, 5)
  - [ ] Verify rejected items disappear from "Pending" list in Dashboard.
  - [ ] Verify rejected items do NOT appear in public list (`getPublishedScholarships`).

## Dev Notes

- **UX:** Use red color for the Reject button.
- **Safety:** Require explicit confirmation.

### Project Structure Notes

- Page: `src/pages/admin/ReviewScholarship.tsx`

### References

- [Source: BMAD_OUTPUT/planning-artifacts/epics.md #Story 3.4]

## Dev Agent Record

### Agent Model Used

Gemini 2.0 Flash

### Debug Log References

### Completion Notes List

- Rejection workflow implemented with destructive UI warning.
- Translations added for rejection flow.
- Tests updated to handle async dialog interactions.
- CR Fix: Used `waitFor` in tests to fix async assertion failures.
- CR Fix: Ensured mock state consistency between tests.
