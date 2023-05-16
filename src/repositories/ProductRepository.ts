import { Product } from '../models/Product'

class ProductRepository {
  nextId = 1
  items: Product[] = []
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
