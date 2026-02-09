# Story 3.1: Admin Dashboard & Access Management

Status: done

## Story

As an Administrator,
I want to see a list of scholarships waiting for review and manage user permissions,
so that I can ensure data quality and delegate administrative tasks.

## Acceptance Criteria

1. **Given** I am logged in with an 'admin' role
2. **When** I visit the `/admin` dashboard
3. **Then** I see a list of scholarships with status 'PENDING_REVIEW'
4. **And** I can see a "User Management" section
5. **And** I can promote another user to 'admin' role via their User ID
6. **And** users without 'admin' role are redirected to home

## Tasks / Subtasks

- [x] Task 1: Initial Admin Promotion (AC: 1)
  - [x] Create `prisma/sql/promote_first_admin.sql` with instructions to use the `set_admin_role` function
- [x] Task 2: Admin Dashboard UI (AC: 2, 3)
  - [x] Create `src/pages/admin/Dashboard.tsx`
  - [x] Implement fetch logic for `PENDING_REVIEW` scholarships (restricted by RLS)
  - [x] Use Shadcn Table component to display results
- [x] Task 3: Access Management UI (AC: 4, 5)
  - [x] Add a "Promote User" form in the Dashboard
  - [x] Implement `handlePromote` using `supabase.rpc('set_admin_role', { user_id: '...' })`
  - [x] Handle success/error toasts
- [x] Task 4: Admin Routing (AC: 6)
  - [x] Add `/admin` route in `src/main.tsx` protected by `AdminRoute` component

## Dev Notes

- **Admin Account:** Since we can't create users via code easily without Admin Auth API, the first user must sign up via UI, then the developer promotes them using the SQL script.
- **RPC:** Using `supabase.rpc` is the cleanest way to call the `set_admin_role` function from the frontend.

### Project Structure Notes

- Admin Page: `src/pages/admin/Dashboard.tsx`
- Routing: `src/main.tsx`

### References

- [Source: BMAD_OUTPUT/planning-artifacts/epics.md #Story 3.1]
- [Source: prisma/sql/set_admin_role.sql]

## Dev Agent Record

### Agent Model Used

Gemini 2.0 Flash

### Debug Log References

- Created SQL script for initial admin promotion.
- Implemented Admin Dashboard with user promotion capability.
- Configured secure routing for the Admin section.
- Added unit test for Admin Dashboard rendering.

### Completion Notes List

- Trust Center initialization complete.
- Administrators can now promote other users from the UI.
- Pending scholarships are listed and ready for the next review step.
- CR Fix: Centralized all admin strings in i18n.
- CR Fix: Added UUID validation for promotion form.
- CR Fix: Added Admin link in Navbar for users with admin role.
- CR Fix: Added loading state to scholarship table.

### File List

- prisma/sql/promote_first_admin.sql
- src/pages/admin/Dashboard.tsx
- src/main.tsx
- src/pages/admin/Dashboard.test.tsx
