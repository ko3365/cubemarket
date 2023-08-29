import dotenv from 'dotenv'

import { FastifyPluginAsync } from 'fastify'
import { LoginInput } from '../../models/DataTypes'
import { fp_authPlugin } from '../../plugins/auth'

import UserRepository from '../../repositories/UserRepository'

const userRepo = new UserRepository()

dotenv.config()
const jwtKey = process.env.JWT_KEY as string

const authRoute: FastifyPluginAsync = async (fastify) => {
  fastify.register(fp_authPlugin)

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
    if (!request.user) {
      reply.code(401)
      throw new Error('unauthorized')
    }
    return userRepo.delete(request.user)
  })

  fastify.post('/logout', (request, reply) => {
    reply.clearCookie('token')
    return 'logout'
  })
}

export default authRoute
