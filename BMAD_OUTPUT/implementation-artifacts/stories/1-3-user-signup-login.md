# Story 1.3: User Signup & Login

Status: done

## Story

As a Contributor User,
I want to sign up and log in to the platform,
so that I can submit scholarships and track my contributions.

## Acceptance Criteria

1. **Given** a visitor on the login page
2. **When** they enter valid credentials (email/password) or use a social provider
3. **Then** a new user account is created in Supabase Auth
4. **And** they receive a valid JWT session
5. **And** the 'authenticated' RLS role is applied to their session

## Tasks / Subtasks

- [x] Task 1: Auth Configuration (Supabase) (AC: 1, 2)
  - [x] Verify Supabase Auth is enabled in the project (Email/Password provider is default)
  - [x] Update `.env` with redirect URL if needed for OAuth (optional for V1)
- [x] Task 2: Login Page Implementation (AC: 1, 2)
  - [x] Update `src/pages/auth/Login.tsx` to use Supabase Auth UI or custom form
  - [x] Implement `signInWithPassword` and `signUp` logic using `supabaseClient`
  - [x] Handle loading states and error messages (User friendly toasts)
- [x] Task 3: Session Management & Navbar (AC: 3, 4, 5)
  - [x] Implement `useAuth` hook (or use existing if available in starter) to track session state
  - [x] Update `Navbar.tsx` to show "Sign In" when logged out
  - [x] Update `Navbar.tsx` to show User Avatar/Logout when logged in
  - [x] Verify Logout functionality clears the session

## Dev Notes

- **Supabase Auth UI:** Consider using `@supabase/auth-ui-react` for speed, as it's already in `package.json`.
- **State Management:** Use `onAuthStateChange` listener in a Context provider to keep the session global.
- **Routing:** Protect routes that require auth (e.g., `/submit`) with a `<ProtectedRoute>` wrapper later (part of Epic 5, but good to keep in mind).

### Project Structure Notes

- Auth Page: `src/pages/auth/Login.tsx`
- Components: `src/features/auth/`
- Navigation: `src/components/Navbar.tsx`

### References

- [Source: BMAD_OUTPUT/planning-artifacts/epics.md #Story 1.3]
- [Source: package.json (Dependencies)]

## Dev Agent Record

### Agent Model Used

Gemini 2.0 Flash

### Debug Log References

- Implemented Login page using `@supabase/auth-ui-react`.
- Updated Navbar to track session state using `supabase.auth.onAuthStateChange`.
- Cleaned up routing in `main.tsx` and `App.tsx` to allow public access and remove ERP bloat.
- Configured Vitest for React testing with `happy-dom`.

### Completion Notes List

- User Authentication flow (Sign Up / Login / Logout) implemented.
- Session state is globally managed and reflected in the UI.
- Routing architecture simplified.

### File List

- src/pages/auth/Login.tsx
- src/components/Navbar.tsx
- src/App.tsx
- src/main.tsx
- src/pages/auth/Login.test.tsx
- vite.config.ts (Updated for test config)
