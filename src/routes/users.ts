import { randomUUID } from 'crypto'
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'

export const usersRoute = async (app: FastifyInstance) => {
  app.post('/', async (request: FastifyRequest, response: FastifyReply) => {
    const userRequestBodySchema = z.object({
      name: z.string().min(4),
      email: z.string().email(),
    })

    const { email, name } = userRequestBodySchema.parse(request.body)

    let { sessionId } = request.cookies

    if (!sessionId) {
      sessionId = randomUUID()
      response.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    }

    await knex('users').insert({
      id: randomUUID(),
      name,
      email,
      session_id: sessionId,
    })

    return response.status(201).send()
  })
}
