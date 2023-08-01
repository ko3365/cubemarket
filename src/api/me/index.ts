import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

import { FastifyPluginAsync } from 'fastify'

//import UserRepository from '../../repositories/UserRepository'

//const userRepo = new UserRepository()

dotenv.config()
const jwtKey = process.env.JWT_KEY as string

const meRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', (request, reply) => {
    try {
      const me = jwt.verify(request.cookies.token, jwtKey)
      return me
    } catch (err) {
      reply.code(401) // unauthorized
      throw new Error('unauthorized')
    }
  })

  fastify.patch('/notifications', () => {
    return 'patch notifications'
  })

  /*
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
      try {
        const me = jwt.verify(request.cookies.token, jwtKey)
        return userRepo.delete(me)
      } catch (err) {
        reply.code(401) // unauthorized
        throw new Error('unauthorized')
      }
    })
  
    fastify.post('/logout', (request, reply) => {
      reply.clearCookie('token')
      return 'logout'
    })*/
}

export default meRoute
