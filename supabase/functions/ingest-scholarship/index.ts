import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, content-type',
}

// Initialize Supabase Client outside the handler for connection reuse
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
const supabase = createClient(supabaseUrl, supabaseServiceKey)

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Authorization Check
    const authHeader = req.headers.get('Authorization')
    const expectedKey = Deno.env.get('INGESTION_KEY')

    if (!expectedKey) {
      console.error('[CRITICAL] INGESTION_KEY environment variable is not set')
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (!authHeader || authHeader.split(' ')[1] !== expectedKey) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 2. Payload Size Check
    const contentLength = req.headers.get('content-length')
    if (contentLength && parseInt(contentLength) > 500000) {
      return new Response(JSON.stringify({ error: 'Payload too large (limit 500KB)' }), {
        status: 413,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const body = await req.json()
    const { source_id, payload } = body

    // 3. Validation
    if (!source_id || !payload || typeof payload !== 'object') {
      return new Response(JSON.stringify({ error: 'Invalid structure: source_id and payload (object) are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 4. Insert into DB
    const { data, error } = await supabase
      .from('raw_scholarships')
      .insert([
        { source_id, payload, ingestion_status: 'PENDING' }
      ])
      .select()
      .single()

    if (error) {
      console.error('[DATABASE ERROR] Ingestion failed:', error)
      return new Response(JSON.stringify({ error: 'Database insertion failed' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ 
      message: 'Ingestion successful', 
      id: data.id 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 201,
    })

  } catch (error) {
    console.error('[UNEXPECTED ERROR]:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})