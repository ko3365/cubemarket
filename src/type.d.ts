import fastify from 'fastify'

declare module 'fastify' {
  interface FastifyRequest {
    user: { id: number; username: string } | null
  }
}
