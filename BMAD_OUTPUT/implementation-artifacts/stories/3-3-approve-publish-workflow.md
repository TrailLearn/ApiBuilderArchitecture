# Story 3.3: Approve & Publish Workflow

Status: done

## Story

As an Administrator,
I want to officially publish a validated scholarship,
so that it becomes visible to the public.

## Acceptance Criteria

1. **Given** I have reviewed a scholarship and verified its details
2. **When** I click the 'Approve & Publish' button
3. **Then** the scholarship status is updated to 'PUBLISHED'
4. **And** it immediately becomes visible to the public API
5. **And** an audit log event is recorded for this action (Implicit via DB state change for V1)

## Tasks / Subtasks



- [x] Task 1: Publish Logic (AC: 3)

  - [x] Update `src/features/scholarships/api.ts` to support status updates (already covered by generic update, but good to v

erify).

- [x] Task 2: UI Implementation (AC: 2)

  - [x] Add "Approve & Publish" button to `ReviewScholarship.tsx`.

  - [x] Add confirmation dialog (optional but recommended).

  - [x] Handle state transition to 'PUBLISHED'.

- [x] Task 3: Verification (AC: 4)

  - [x] Create a test/script to verify that once published, it appears in the public list (using `getPublishedScholarships`).



## Dev Notes



- **Optimistic UI:** When published, redirect to dashboard and show toast.

- **Safety:** Ensure only Admins can execute this update (RLS already handles this).



### Project Structure Notes



- Page: `src/pages/admin/ReviewScholarship.tsx`



### References



- [Source: BMAD_OUTPUT/planning-artifacts/epics.md #Story 3.3]



## Dev Agent Record



### Agent Model Used



Gemini 2.0 Flash



### Debug Log References



- Updated translations for admin actions.

- Implemented `ReviewScholarship` page with publication workflow.

- Created `src/components/ui/textarea.tsx` to fix missing component dependency.

- Verified functionality with `src/pages/admin/ReviewScholarship.test.tsx`.



### Completion Notes List







- Admin can review, edit, and publish scholarships.



- UI includes confirmation dialog for safety.



- Tests verify the status update logic.



- CR Fix: Unified update logic for drafts and publication.



- CR Fix: Enforced form validation even when publishing through modal.



- CR Fix: Full i18n support for all page labels and toasts.



### File List



- src/pages/admin/ReviewScholarship.tsx

- src/features/scholarships/api.ts

- src/components/ui/textarea.tsx

- src/pages/admin/ReviewScholarship.test.tsx

- src/i18n/resources/en/admin.ts
