import Fastify from 'fastify'
import cookie from '@fastify/cookie'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

import ProductRepository from './repositories/ProductRepository'
import UserRepository from './repositories/UserRepository'

import { Product } from './models/DataTypes'
import { ProductWithoutID } from './models/DataTypes'
import { LoginInput } from './models/DataTypes'

const productRepo = new ProductRepository()
const userRepo = new UserRepository()

dotenv.config()
const jwtKey = process.env.JWT_KEY as string

const fastify = Fastify({
  logger: true,
})

fastify.register(cookie, {})

fastify.get('/', async function (request, reply) {
  //reply.send('hello world')
  return 'hello world'
})

// Authentication
fastify.post<{ Body: LoginInput }>('/api/auth/signup', async (request, reply) => {
  const result = await userRepo.register(request.body)
  if (!result) {
    return null
  }
  reply.setCookie('token', result.token, { path: '/' })
  return result.user
})

fastify.post<{ Body: LoginInput }>('/api/auth/signin', async (request, reply) => {
  const result = await userRepo.login(request.body)
  if (!result) {
    return null
  }
  reply.setCookie('token', result.token, { path: '/' })
  return result.user
})

fastify.delete<{ Body: LoginInput }>('/api/auth/unregister', (request) => {
  return userRepo.delete(request.body)
})

fastify.post('/api/auth/logout', (request, reply) => {
  reply.clearCookie('token')
  return 'logout'
})

fastify.get('/api/me', (request, reply) => {
  try {
    const me = jwt.verify(request.cookies.token, jwtKey)
    return me
  } catch (err) {
    reply.code(401) // unauthorized
    throw new Error('unauthorized')
  }
})

fastify.patch('/api/me/notifications', () => {
  return 'patch notifications'
})

// Products
fastify.get('/api/products', () => {
  return productRepo.findAll()
})

fastify.post<{ Body: Omit<Product, 'id'> }>('/api/products', (request, reply) => {
  try {
    const me = jwt.verify(request.cookies.token, jwtKey)
    return productRepo.create(request.body, me)
  } catch (err) {
    reply.code(401) // unauthorized
    throw new Error('unauthorized')
  }
})

fastify.get<{ Params: { id: string } }>('/api/products/:id', (request) => {
  //console.log(request.params.id)
  const id = parseInt(request.params.id, 10)
  return productRepo.findById(id)
})

fastify.put<{ Params: { id: string }; Body: Omit<ProductWithoutID, 'username'> }>(
  '/api/products/:id',
  (request, reply) => {
    const id = parseInt(request.params.id, 10)
    try {
      const me = jwt.verify(request.cookies.token, jwtKey)
      return productRepo.updateById(id, request.body, me)
    } catch (err) {
      reply.code(401) // unauthorized
      throw new Error('not logged in')
    }
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
