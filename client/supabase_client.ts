import { createClient } from '@supabase/supabase-js'


const supabase_url = process.env.SUPABASE_URL as string
const supabase_public_key = process.env.SUPABASE_PUBLISHABLE_KEY as string

if (!supabase_url || !supabase_public_key) 
    throw new Error("Input environment variables")


export const supabase_client = createClient(supabase_url, supabase_public_key)