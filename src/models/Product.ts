import { Database } from '../../lib/data_type'

/*
export type Product = {
  id: number
  name: string
  created_at: string
}
*/
export type ProductType = Database['public']['Tables']['products']['Row']
