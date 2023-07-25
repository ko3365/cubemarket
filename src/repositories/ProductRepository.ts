import { Product } from '../models/DataTypes'
import { ProductWithoutID } from '../models/DataTypes'
import { supabase } from '../../lib/supabase'
import { UserInfo } from '../models/DataTypes'

class ProductRepository {
  /*nextId = 1
  items: Product[] = []

  findIndexById(id: number): number | null {
    const itemIndex = this.items.findIndex(function (item) {
      return item.id == id
    })
    if (itemIndex === undefined) {
      return null
    }
    return itemIndex
  }*/

  async create(params: Omit<Product, 'id'>, me: UserInfo): Promise<Product[] | null> {
    const product = { ...params, username: me.username }
    const { data, error } = await supabase.from('products').insert(product).select('*')
    return data
  }

  async findAll(): Promise<Product[] | null> {
    //return this.items
    const { data, error } = await supabase.from('products').select('*')
    return data
  }

  async findById(id: number): Promise<Product[] | null> {
    const id_string = id.toString()
    const { data, error } = await supabase.from('products').select('*').eq('id', id)
    return data

    //: Product | null{
    /*
    //items 에서 id 찾아 반환 없으면 null
    const item = this.items.find(function (item, index) {
      return item.id == id
    })

    if (item === undefined) {
      return null
    }
    return item
    */
  }

  async updateById(
    id: number,
    params: Omit<ProductWithoutID, 'username'>,
    me: UserInfo
  ): Promise<Product[] | null> {
    const id_string = id.toString()
    const username = me.username
    const result = await this.findById(id)
    if (!result) {
      return null
    }
    if (result[0].username != username) {
      throw new Error('unathorized')
    } else {
      const { data, error } = await supabase
        .from('products')
        .update({ name: params.name })
        .eq('id', id)
        .select('*')
      return data
    }
    //: Product | null{
    /*
    const itemIndex = this.findIndexById(id)
    if (itemIndex === null) {
      return null
    }
    const product = { ...params, id: id }
    this.items[itemIndex] = product
    return product
    */
  }

  async removeById(id: number): Promise<Product[] | null> {
    const id_string = id.toString()
    const { data, error } = await supabase.from('products').delete().eq('id', id_string).select('*')
    return data
    /*: Product | null {
    const itemIndex = this.findIndexById(id)
    if (itemIndex === null) {
      return null
    }
    // Remove Item from Array
    const product = this.items[itemIndex]
    this.items.splice(itemIndex, 1)
    return product
    */
  }
}

export default ProductRepository
