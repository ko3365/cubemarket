import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

import { FastifyPluginAsync } from 'fastify'
import { ProductWithoutID } from '../../models/DataTypes'
import { Product } from '../../models/DataTypes'

import ProductRepository from '../../repositories/ProductRepository'

const productRepo = new ProductRepository()

dotenv.config()
const jwtKey = process.env.JWT_KEY as string

const productRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', () => {
    return productRepo.findAll()
  })

  fastify.get<{ Params: { id: string } }>('/:id', (request) => {
    //console.log(request.params.id)
    const id = parseInt(request.params.id, 10)
    return productRepo.findById(id)
  })

  fastify.put<{ Params: { id: string }; Body: Omit<Product, 'id' | 'user_id' | 'username'> }>('/:id', (request, reply) => {
    const id = parseInt(request.params.id, 10)
    try {
      const me = jwt.verify(request.cookies.token, jwtKey)
      return productRepo.updateById(id, request.body, me)
    } catch (err) {
      reply.code(401) // unauthorized
      throw new Error('not logged in')
    }
  })

  fastify.post<{ Body: Omit<Product, 'id' | 'user_id' | 'username'> }>('/', (request, reply) => {
    try {
      const me = jwt.verify(request.cookies.token, jwtKey)
      return productRepo.create(request.body, me)
    } catch (err) {
      reply.code(401) // unauthorized
      throw new Error('unauthorized')
    }
  })

  fastify.delete<{ Params: { id: string } }>('/:id', (request, reply) => {
    const id = parseInt(request.params.id, 10)
    try {
      const me = jwt.verify(request.cookies.token, jwtKey)
      productRepo.removeById(id, me)
    } catch (err) {
      reply.code(401) // unauthorized
      throw new Error('unauthorized')
    }
    //productRepo.removeById(id)
    reply.status(204).send(undefined)
  })
}

export default productRoute
