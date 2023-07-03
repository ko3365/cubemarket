import { Database } from '../../lib/data_types'

/*
export type Product = {
  id: number
  name: string
  created_at: string
}
*/
export type Product = Database['public']['Tables']['products']['Row']
export type User = Database['public']['Tables']['users']['Row']
export type ProductWithoutID = Omit<Product, 'id'>
export type LoginInput = { username: string; password: string }
export type UserInfo = Omit<User, 'password_hash' | 'created_at'>
