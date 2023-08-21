import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

import { LoginInput } from '../../models/DataTypes'
import { verifyAccessToken } from '../../lib/jwtToken'

import { FastifyPluginAsync } from 'fastify'

//import UserRepository from '../../repositories/UserRepository'

//const userRepo = new UserRepository()

dotenv.config()
const jwtKey = process.env.JWT_KEY as string

const meRoute: FastifyPluginAsync = async (fastify) => {
  let me = undefined

  fastify.get('/', (request, reply) => {
    /*try {
      const me = jwt.verify(request.cookies.token, jwtKey)
      return me
    } catch (err) {
      reply.code(401) // unauthorized
      throw new Error('unauthorized')
    }
    */
    console.log(me)
    if (me === undefined) {
      reply.code(401)
      throw new Error('unauthorized')
    } else {
      return me
    }
  })

  fastify.addHook<{ Body: LoginInput }>('onRequest', async (request, reply) => {
    if (!(request.cookies.token === undefined)) {
      me = verifyAccessToken(request.cookies.token)
    }
  })

  fastify.patch('/notifications', () => {
    return 'patch notifications'
  })
}

export default meRoute
