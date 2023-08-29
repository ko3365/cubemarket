import dotenv from 'dotenv'

import { LoginInput } from '../../models/DataTypes'
import { verifyAccessToken } from '../../lib/jwtToken'

import { FastifyPluginAsync } from 'fastify'
import { fp_authPlugin } from '../../plugins/auth'

//import UserRepository from '../../repositories/UserRepository'

//const userRepo = new UserRepository()

dotenv.config()
const jwtKey = process.env.JWT_KEY as string

const meRoute: FastifyPluginAsync = async (fastify) => {
  fastify.register(fp_authPlugin)

  fastify.get('/', (request, reply) => {
    if (!request.user) {
      reply.code(401)
      throw new Error('unauthorized')
    }
    return request.user
  })

  fastify.patch('/notifications', () => {
    return 'patch notifications'
  })
}

export default meRoute
