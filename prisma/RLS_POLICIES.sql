-- Commande à exécuter après le premier 'npm run migrate' pour activer la sécurité
ALTER TABLE scholarships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published scholarships" ON scholarships
FOR SELECT TO anon, authenticated
USING (status = 'PUBLISHED');