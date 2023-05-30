import Fastify from 'fastify'
import ProductRepository from './repositories/ProductRepository'
import { Product } from './models/Product'
const productRepo = new ProductRepository()

const fastify = Fastify({
  logger: true,
})

fastify.get('/', async function (request, reply) {
  //reply.send('hello world')
  return 'hello world'
})

// Authentication
fastify.post('/api/auth/signup', () => {
  return 'signup'
})

fastify.post('/api/auth/signin', () => {
  return 'signin'
})

fastify.delete('/api/auth/unregister', () => {
  return 'unregister'
})

fastify.post('/api/auth/logout', () => {
  return 'logout'
})

fastify.get('/api/me', () => {
  return 'get me'
})

fastify.patch('/api/me/notifications', () => {
  return 'patch notifications'
})

// Products
fastify.get('/api/products', () => {
  return productRepo.findAll()
})

fastify.post<{ Body: Omit<Product, 'id'> }>('/api/products', (request) => {
  return productRepo.create(request.body)
})

fastify.get<{ Params: { id: string } }>('/api/products/:id', (request) => {
  //console.log(request.params.id)
  const id = parseInt(request.params.id, 10)
  return productRepo.findById(id)
})

fastify.put<{ Params: { id: string }; Body: Omit<Product, 'id'> }>(
  '/api/products/:id',
  (request) => {
    const id = parseInt(request.params.id, 10)
    return productRepo.updateById(id, request.body)
  }
)

fastify.delete<{ Params: { id: string } }>('/api/products/:id', (request, reply) => {
  const id = parseInt(request.params.id, 10)
  productRepo.removeById(id)
  reply.status(204).send(undefined)
})

fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})

/*
interface example<T> {
  name: string
  price: number
  option: T
}

function wrap<D>(data: D): { data: D } {
  const value: D = data
  return {
    data: value,
  }
}
*/
