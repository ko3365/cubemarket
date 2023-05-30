import { Product } from '../models/Product'
type ProductWithoutId = Omit<Product, 'id'>

// Supabase Initialization
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()
const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseKey = process.env.SUPABASE_KEY as string
const supabase = createClient(supabaseUrl, supabaseKey)

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

  async create(params: Omit<Product, 'id'>) {
    const product = { ...params }
    const { data, error } = await supabase.from('products').insert(product).select('*')
    return data
  }

  async findAll() {
    //return this.items
    const { data, error } = await supabase.from('products').select('*')
    return data
  }

  async findById(id: number) {
    const id_string = id.toString()
    const { data, error } = await supabase.from('products').select('*').eq('id', id_string)
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

  async updateById(id: number, params: ProductWithoutId) {
    const id_string = id.toString()
    const product = { ...params }
    const { data, error } = await supabase
      .from('products')
      .update(product)
      .eq('id', id_string)
      .select('*')
    return data

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

  async removeById(id: number) {
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
