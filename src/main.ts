import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()
/*
function main() {
    const message: string = 'World'
    console.log(`Hello ${message}!`)
  }
  
  main()
*/

const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseKey = process.env.SUPABASE_KEY as string
const supabase = createClient(supabaseUrl, supabaseKey)

//let { data: products, error } = await supabase.from('products').select('*')
const { data, error } = await supabase.from('products').select('*') //.eq('id', '3')

console.log(data)
