import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

import { FastifyPluginAsync } from 'fastify'
import { verifyAccessToken } from '../../lib/jwtToken'
import { LoginInput } from '../../models/DataTypes'

import UserRepository from '../../repositories/UserRepository'

const userRepo = new UserRepository()

dotenv.config()
const jwtKey = process.env.JWT_KEY as string

const authRoute: FastifyPluginAsync = async (fastify) => {
  let me = undefined
  fastify.post<{ Body: LoginInput }>('/signup', async (request, reply) => {
    const result = await userRepo.register(request.body)
    if (!result) {
      return null
    }
    reply.setCookie('token', result.token, { path: '/' })
    return result.user
  })

  fastify.post<{ Body: LoginInput }>('/signin', async (request, reply) => {
    const result = await userRepo.login(request.body)
    if (!result) {
      return null
    }
    reply.setCookie('token', result.token, { path: '/' })
    return result.user
  })

  fastify.delete('/unregister', (request, reply) => {
    if (!(me === undefined)) {
      return userRepo.delete(me)
    } else {
      reply.code(401)
      throw new Error('unauthorized')
    }
  })

  fastify.post('/logout', (request, reply) => {
    reply.clearCookie('token')
    return 'logout'
  })

  fastify.addHook<{ Body: LoginInput }>('onRequest', async (request, reply) => {
    if (!(request.cookies.token === undefined)) {
      me = verifyAccessToken(request.cookies.token)
    }
  })
}

export default authRoute
