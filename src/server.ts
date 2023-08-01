import Fastify from 'fastify'
import cookie from '@fastify/cookie'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

import ProductRepository from './repositories/ProductRepository'
import UserRepository from './repositories/UserRepository'

import { Product } from './models/DataTypes'
import { ProductWithoutID } from './models/DataTypes'
import { LoginInput } from './models/DataTypes'

import apiRoute from './api'

const productRepo = new ProductRepository()
const userRepo = new UserRepository()

dotenv.config()
const jwtKey = process.env.JWT_KEY as string

const fastify = Fastify({
  logger: true,
})

fastify.register(cookie, {})
fastify.register(apiRoute, { prefix: '/api' })

fastify.get('/', async function (request, reply) {
  //reply.send('hello world')
  return 'hello world'
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
