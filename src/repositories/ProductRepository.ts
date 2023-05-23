import { Product } from '../models/Product'
type ProductWithoutId = Omit<Product, 'id'>
class ProductRepository {
  nextId = 1
  items: Product[] = []

  findIndexById(id: number): number | null {
    const itemIndex = this.items.findIndex(function (item) {
      return item.id == id
    })
    if (itemIndex === undefined) {
      return null
    }
    return itemIndex
  }

  findById(id: number): Product | null {
    //items 에서 id 찾아 반환 없으면 null
    const item = this.items.find(function (item, index) {
      return item.id == id
    })

    if (item === undefined) {
      return null
    }
    return item
  }

  updateById(id: number, params: ProductWithoutId): Product | null {
    const itemIndex = this.findIndexById(id)
    if (itemIndex === null) {
      return null
    }
    const product = { ...params, id: id }
    this.items[itemIndex] = product
    return product
  }

  removeById(id: number): Product | null {
    const itemIndex = this.findIndexById(id)
    if (itemIndex === null) {
      return null
    }
    // Remove Item from Array
    const product = this.items[itemIndex]
    this.items.splice(itemIndex, 1)
    return product
  }

  findAll() {
    return this.items
  }
  create(params: Omit<Product, 'id'>) {
    const product = { ...params, id: this.nextId }
    this.nextId += 1
    this.items.push(product)
    return product
  }
}

export default ProductRepository
