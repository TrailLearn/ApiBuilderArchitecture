# Story 3.2: Review & Edit Interface

Status: ready-for-dev

## Story

As an Administrator,
I want to edit the details of a scholarship draft,
so that I can correct typos or formatting issues before publication.

## Acceptance Criteria

1. **Given** I am viewing a pending scholarship
2. **When** I edit the form fields (Title, Amount, Description) and click 'Save Draft'
3. **Then** the record in the `scholarships` table is updated
4. **And** the status remains 'PENDING_REVIEW'
5. **And** the changes are persisted for the next review step

## Tasks / Subtasks

- [x] Task 1: Review Page UI (AC: 1)
  - [x] Create `src/pages/admin/ReviewScholarship.tsx`
  - [x] Add route `/admin/review/:id` in `src/main.tsx` protected by `AdminRoute`
  - [x] Fetch scholarship details by ID
- [x] Task 2: Edit Form Implementation (AC: 2)
  - [x] Create a form with Title, Amount, Description, Source URL (read-only)
  - [x] Use React Hook Form + Zod for validation (optional but good practice) or simple state
- [x] Task 3: Save Logic (AC: 3, 4, 5)
  - [x] Implement `updateScholarship` function in `src/features/scholarships/api.ts` (Admin only)
  - [x] Call Supabase `update` on 'Save Draft' click
  - [x] Show success toast and redirect to dashboard (or stay on page)

## Dev Notes

- **Reuse:** Can we reuse a generic `ScholarshipForm` component? For V1, a specific admin form is fine to move fast.
- **Security:** Ensure RLS allows update for admins (already done in Story 1.4).

### Project Structure Notes

- Page: `src/pages/admin/ReviewScholarship.tsx`

### References

- [Source: BMAD_OUTPUT/planning-artifacts/epics.md #Story 3.2]

## Dev Agent Record

### Agent Model Used

Gemini 2.0 Flash

### Debug Log References

- Implemented `ReviewScholarship.tsx` with react-hook-form.
- Added `updateScholarship` to API layer.
- Configured routing in `src/main.tsx`.

### Completion Notes List

- Admin Review interface is operational.
- Admins can edit draft details of pending scholarships.
- Changes are saved without altering the review status (allows multiple edits).

### File List

- src/pages/admin/ReviewScholarship.tsx
- src/main.tsx
- src/features/scholarships/api.ts
