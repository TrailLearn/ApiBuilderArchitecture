---
id: "1.4"
epic: "Identity & Access (Auth & RLS)"
status: "todo"
---

# Story 1.4: Admin Role Management (JWT Claims)

As a System Administrator,
I want a secure way to assign Admin roles that users cannot tamper with,
So that I can protect sensitive administrative functions.

**Acceptance Criteria:**

**Given** a user needs admin privileges
**When** the system administrator runs the 'set_admin_role' secure database function
**Then** the target user's `app_metadata` is updated with `role: 'admin'`
**And** RLS policies granting full access to 'admin' role become active for that user
**And** standard users cannot modify their own `app_metadata`