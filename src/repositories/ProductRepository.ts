import { Product } from '../models/DataTypes'
import { supabase } from '../lib/supabase'
import { UserInfo } from '../models/DataTypes'

class ProductRepository {
  async create(params: Omit<Product, 'id' | 'user_id' | 'username'>, me: UserInfo): Promise<Product[] | null> {
    const product = { ...params, username: me.username, user_id: me.id }
    const { data, error } = await supabase.from('products').insert(product).select('*')
    return data
  }

  async findAll(): Promise<Product[] | null> {
    const { data, error } = await supabase.from('products').select('*')
    return data
  }

  async findById(id: number): Promise<Product[] | null> {
    const { data, error } = await supabase.from('products').select('*').eq('id', id)
    return data
  }

  async updateById(id: number, params: Omit<Product, 'id' | 'user_id' | 'username'>, me: UserInfo): Promise<Product[] | null> {
    const username = me.username
    const user_id = me.id
    const result = await this.findById(id)
    if (!result) {
      return null
    }
    if (result[0].user_id != user_id) {
      throw new Error('unathorized')
    } else {
      const { data, error } = await supabase.from('products').update({ name: params.name }).eq('id', id).select('*')
      return data
    }
  }

  async removeById(id: number, me: UserInfo): Promise<Product[] | null> {
    const username = me.username
    const user_id = me.id
    const result = await this.findById(id)
    if (!result) {
      return null
    }
    if (result[0].user_id != user_id) {
      throw new Error('unathorized')
    } else {
      const { data, error } = await supabase.from('products').delete().eq('id', id).select('*')
      return data
    }
  }
}

export default ProductRepository
