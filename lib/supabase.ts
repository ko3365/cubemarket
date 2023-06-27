import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { Database } from './data_types'

dotenv.config()
const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseKey = process.env.SUPABASE_KEY as string
const supabase_client = createClient<Database>(supabaseUrl, supabaseKey)

export const supabase = supabase_client
