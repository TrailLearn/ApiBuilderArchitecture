-- Commande a executer apres le premier 'npm run migrate' pour activer la securite
ALTER TABLE scholarships ENABLE ROW LEVEL SECURITY;

-- 1. Public Read Access
CREATE POLICY "Public can view published scholarships" ON scholarships
FOR SELECT TO anon, authenticated
USING (status = 'PUBLISHED');

-- 2. Admin Full Access
-- Allows Select, Insert, Update, Delete if the user has 'admin' role in app_metadata
CREATE POLICY "Admins have full access" ON scholarships
FOR ALL TO authenticated
USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');