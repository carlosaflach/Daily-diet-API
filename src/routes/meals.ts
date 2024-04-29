import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { checkSessionIdExists } from '../middlewares/validateSessionId'
import { knex } from '../database'
import { randomUUID } from 'crypto'
import {
  mealIdParamsSchema,
  mealsUpsertBodySchema,
} from '../schemas/meals.schema'

export const mealsRoute = async (app: FastifyInstance) => {
  app.addHook('preHandler', checkSessionIdExists)

  app.post('/', async (request: FastifyRequest, response: FastifyReply) => {
    const { date, description, isOnDiet, name } = mealsUpsertBodySchema.parse(
      request.body,
    )

    await knex('meals').insert({
      id: randomUUID(),
      name,
      description,
      user_id: request.user?.id,
      date,
      is_on_diet: isOnDiet,
    })

    return response.status(201).send()
  })

  app.get('/:id', async (request: FastifyRequest, response: FastifyReply) => {
    const { id } = mealIdParamsSchema.parse(request.params)

    const meal = await knex('meals').where('id', id).first()

    if (!meal) {
      return response.status(404).send({ message: 'Recipe not found' })
    }

    return response.status(200).send({ meal })
  })

  app.get('/', async (request: FastifyRequest, response: FastifyReply) => {
    const userMeals = await knex('meals')
      .where('user_id', request.user?.id)
      .select()

    const parsedUserMeals = userMeals.map((meal) => {
      return {
        ...meal,
        is_on_diet: Boolean(meal.is_on_diet),
        date: new Date(meal.date),
      }
    })

    return response.status(200).send({
      meals: parsedUserMeals,
    })
  })

  app.put('/:id', async (request: FastifyRequest, response: FastifyReply) => {
    const { id } = mealIdParamsSchema.parse(request.params)

    const { name, date, description, isOnDiet } = mealsUpsertBodySchema.parse(
      request.body,
    )

    const meal = await knex('meals').where('id', id).first()

    if (!meal) {
      return response.status(404).send({ message: 'Recipe not found' })
    }

    await knex('meals').where({ id }).update({
      name,
      description,
      is_on_diet: isOnDiet,
      date,
    })

    return response.status(204).send()
  })

  app.delete(
    '/:id',
    async (request: FastifyRequest, response: FastifyReply) => {
      const { id } = mealIdParamsSchema.parse(request.params)

      const meal = await knex('meals').where('id', id).first()

      if (!meal) {
        return response.status(404).send({ message: 'Recipe not found' })
      }

      await knex('meals').delete().where('id', id)

      return response.status(204).send()
    },
  )
}
