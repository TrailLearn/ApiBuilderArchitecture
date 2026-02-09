-- Enable RLS on raw_scholarships
ALTER TABLE raw_scholarships ENABLE ROW LEVEL SECURITY;

-- Explicitly restrict all access for non-privileged roles
-- Service role bypasses this automatically
CREATE POLICY "Restrict all access to raw data" ON raw_scholarships
FOR ALL TO public
USING (false);