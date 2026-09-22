import { createClient } from '@supabase/supabase-js'


const supabase_url = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabase_public_key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string
console.log("URL: ", supabase_url)
console.log("Public key: ", supabase_public_key)

if (!supabase_url || !supabase_public_key){
    console.log("Inside") 
    throw new Error("Input environment variables")
}

export const supabase_client = createClient(supabase_url, supabase_public_key)