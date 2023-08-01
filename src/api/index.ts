import { FastifyPluginAsync } from 'fastify'
import productRoute from './products'
import authRoute from './auth'
import meRoute from './me'

const apiRoute: FastifyPluginAsync = async (fastify) => {
  fastify.register(productRoute, { prefix: '/products' })
  fastify.register(authRoute, { prefix: '/auth' })
  fastify.register(meRoute, { prefix: '/me' })

  fastify.get('/', async () => ({
    message: 'api root',
  }))
}

export default apiRoute
