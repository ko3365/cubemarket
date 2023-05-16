
import Fastify from 'fastify'
const fastify = Fastify({
  logger: true,
})

fastify.get('/', async function (request, reply) {
  //reply.send('hello world')
  return 'hello world'
})

// Authentication
fastify.post('/api/auth/signup', () => {
  return 'signup'
})

fastify.post('/api/auth/signin', () => {
  return 'signin'
})

fastify.delete('/api/auth/unregister', () => {
  return 'unregister'
})

fastify.post('/api/auth/logout', () => {
  return 'logout'
})

fastify.get('/api/me', () => {
  return 'get me'
})

fastify.patch('/api/me/notifications', () => {
  return 'patch notifications'
})

// Products
fastify.get('/api/products', () => {
  return 'get products'
})

fastify.post('/api/products', () => {
  return 'post products'
})

fastify.get('/api/products/:id', () => {
  return 'get single product'
})

fastify.put('/api/products/:id', () => {
  return 'put single product'
})

fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})
