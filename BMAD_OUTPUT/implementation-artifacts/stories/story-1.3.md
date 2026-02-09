---
id: "1.3"
epic: "Identity & Access (Auth & RLS)"
status: "todo"
---

# Story 1.3: User Signup & Login

As a Contributor User,
I want to sign up and log in to the platform,
So that I can submit scholarships and track my contributions.

**Acceptance Criteria:**

**Given** a visitor on the login page
**When** they enter valid credentials (email/password) or use a social provider
**Then** a new user account is created in Supabase Auth
**And** they receive a valid JWT session
**And** the 'authenticated' RLS role is applied to their session