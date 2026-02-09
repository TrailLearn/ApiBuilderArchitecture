-- Function to promote a user to admin role
-- SECURITY DEFINER: Runs with privileges of the creator (postgres/superuser), bypassing RLS
-- SET search_path: Critical security measure for security definer functions
-- To be executed in Supabase SQL Editor

create or replace function public.set_admin_role(user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update auth.users
  set raw_app_meta_data = 
    coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb
  where id = user_id;
end;
$$;

-- Revoke execute from public to be safe
revoke execute on function public.set_admin_role(uuid) from public;
revoke execute on function public.set_admin_role(uuid) from anon;
revoke execute on function public.set_admin_role(uuid) from authenticated;

-- Only service_role (and superusers) should execute this if called via API
grant execute on function public.set_admin_role(uuid) to service_role;