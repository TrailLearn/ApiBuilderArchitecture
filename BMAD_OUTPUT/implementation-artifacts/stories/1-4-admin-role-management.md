# Story 1.4: Admin Role Management (JWT Claims)

Status: done

## Story

As a System Administrator,
I want a secure way to assign Admin roles that users cannot tamper with,
so that I can protect sensitive administrative functions.

## Acceptance Criteria

1. **Given** a user needs admin privileges
2. **When** the system administrator runs the 'set_admin_role' secure database function
3. **Then** the target user's `app_metadata` is updated with `role: 'admin'`
4. **And** RLS policies granting full access to 'admin' role become active for that user
5. **And** standard users cannot modify their own `app_metadata`

## Tasks / Subtasks

- [x] Task 1: Secure Database Function (SQL) (AC: 2, 3)
  - [x] Create a Postgres function `set_admin_role(user_id uuid)` security definer
  - [x] The function should update `auth.users` -> `raw_app_meta_data` to include `{"role": "admin"}`
  - [x] Grant execute permission ONLY to service_role (and database owner)
- [x] Task 2: Update RLS Policies for Admin (AC: 4)
  - [x] Update `scholarships` table RLS policies
  - [x] Create policy "Admin Full Access": `ALL` operations allowed `TO authenticated` `USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')`
- [x] Task 3: Admin Guard Component (Frontend) (AC: 4)
  - [x] Create a `AdminRoute` component that checks `session.user.app_metadata.role === 'admin'`
  - [x] Redirect unauthorized users to `/`

## Dev Notes

- **Security:** `app_metadata` is secure (only editable by service_role/admin functions), unlike `user_metadata` (editable by user).
- **Testing:** To test locally, you can call the function via SQL Editor: `select set_admin_role('your-user-uuid');`
- **Prisma:** Remember to put the SQL in `prisma/sql/` or similar for manual execution, as Prisma doesn't manage auth schema directly.

### Project Structure Notes

- SQL Function: `supabase/migrations/` (or `prisma/sql/` for this project context)
- Frontend Guard: `src/components/auth/AdminRoute.tsx`

### References

- [Source: BMAD_OUTPUT/planning-artifacts/architecture.md #Authentication & Security]
- [Source: BMAD_OUTPUT/planning-artifacts/epics.md #Story 1.4]

## Dev Agent Record

### Agent Model Used

Gemini 2.0 Flash

### Debug Log References

- Created `prisma/sql/set_admin_role.sql` to securely promote users.
- Updated `prisma/RLS_POLICIES.sql` to include full Admin access.
- Created `src/components/auth/AdminRoute.tsx` to protect admin routes.
- Added unit tests for AdminRoute in `src/components/auth/AdminRoute.test.tsx`.

### Completion Notes List

- Admin role management infrastructure is in place.
- Backend: Function to assign roles and RLS policies to enforce them.
- Frontend: Guard component to protect UI.
- CR Fix: Secured SQL function with `search_path`.
- CR Fix: Integrated `i18next` in `AdminRoute`.

### File List

- prisma/sql/set_admin_role.sql
- prisma/RLS_POLICIES.sql
- src/components/auth/AdminRoute.tsx
- src/components/auth/AdminRoute.test.tsx
