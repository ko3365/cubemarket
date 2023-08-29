import { FastifyPluginAsync } from 'fastify'

import fp from 'fastify-plugin'

import { verifyAccessToken } from '../lib/jwtToken'

const authPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.decorate('user', null)
  fastify.addHook('preHandler', async (request, reply) => {
    if (!(request.cookies.token === undefined)) {
      try {
        request.user = verifyAccessToken(request.cookies.token)
      } catch (err) {
        reply.code(401) // unauthorized
        throw new Error('unauthorized')
      }
    }
  })
}

export const fp_authPlugin = fp(authPlugin)
