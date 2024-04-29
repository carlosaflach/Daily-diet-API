import { FastifyReply, FastifyRequest } from 'fastify'
import { knex } from '../database'
import { Tables } from 'knex/types/tables'

export const checkSessionIdExists = async (
  request: FastifyRequest,
  response: FastifyReply,
) => {
  const { sessionId } = request.cookies

  if (!sessionId) {
    return response.status(401).send({
      error: 'Unauthorized',
    })
  }

  const user = (await knex('users')
    .where('session_id', sessionId)
    .first()) as unknown as Tables['users']

  if (!user) {
    return response.status(401).send({ error: 'Unauthorized' })
  }

  request.user = user
}
