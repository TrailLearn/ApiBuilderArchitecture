-- Function to process raw scholarships
-- Optimised to BEFORE INSERT to set status without additional UPDATE
CREATE OR REPLACE FUNCTION process_new_scholarship()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_title text;
  v_url text;
  v_amount text;
  v_description text;
BEGIN
  -- Extract fields from JSONB payload and TRIM
  v_title := trim(NEW.payload ->> 'title');
  v_url := trim(NEW.payload ->> 'url');
  v_amount := trim(NEW.payload ->> 'amount');
  v_description := trim(NEW.payload ->> 'description');

  -- Basic validation
  IF v_title IS NULL OR v_url IS NULL OR v_title = '' OR v_url = '' THEN
    NEW.ingestion_status := 'ERROR';
    RETURN NEW;
  END IF;

  -- Check for duplicates
  IF EXISTS (SELECT 1 FROM scholarships WHERE source_url = v_url) THEN
    -- Duplicate found: mark as processed (ignored)
    NEW.ingestion_status := 'PROCESSED';
    RETURN NEW;
  END IF;

  -- Insert into staged table (scholarships)
  INSERT INTO scholarships (title, source_url, amount, description, status)
  VALUES (v_title, v_url, v_amount, v_description, 'PENDING_REVIEW');

  -- Mark current record as processed
  NEW.ingestion_status := 'PROCESSED';

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Handle any errors
  NEW.ingestion_status := 'ERROR';
  RAISE WARNING 'Error processing scholarship: %', SQLERRM;
  RETURN NEW;
END;
$$;

-- Create Trigger (Now as BEFORE INSERT)
DROP TRIGGER IF EXISTS trigger_process_scholarship ON raw_scholarships;

CREATE TRIGGER trigger_process_scholarship
BEFORE INSERT ON raw_scholarships
FOR EACH ROW
EXECUTE FUNCTION process_new_scholarship();