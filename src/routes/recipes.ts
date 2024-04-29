import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { checkSessionIdExists } from '../middlewares/validateSessionId'
import { knex } from '../database'
import { randomUUID } from 'crypto'
import {
  recipeIdParamsSchema,
  recipesUpsertBodySchema,
} from '../schemas/recipes.schema'

export const recipesRoute = async (app: FastifyInstance) => {
  app.addHook('preHandler', checkSessionIdExists)

  app.post('/', async (request: FastifyRequest, response: FastifyReply) => {
    const { date, description, isOnDiet, name } = recipesUpsertBodySchema.parse(
      request.body,
    )

    await knex('recipes').insert({
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
    const { id } = recipeIdParamsSchema.parse(request.params)

    const recipe = await knex('recipes').where('id', id).first()

    if (!recipe) {
      return response.status(404).send({ message: 'Recipe not found' })
    }

    return response.status(200).send({ recipe })
  })

  app.get('/', async (request: FastifyRequest, response: FastifyReply) => {
    const userRecipes = await knex('recipes')
      .where('user_id', request.user?.id)
      .select()

    const parsedUserRecipes = userRecipes.map((recipe) => {
      return {
        ...recipe,
        is_on_diet: Boolean(recipe.is_on_diet),
        date: new Date(recipe.date),
      }
    })

    return response.status(200).send({
      recipes: parsedUserRecipes,
    })
  })

  app.put('/:id', async (request: FastifyRequest, response: FastifyReply) => {
    const { id } = recipeIdParamsSchema.parse(request.params)

    const { name, date, description, isOnDiet } = recipesUpsertBodySchema.parse(
      request.body,
    )

    const recipe = await knex('recipes').where('id', id).first()

    if (!recipe) {
      return response.status(404).send({ message: 'Recipe not found' })
    }

    await knex('recipes').where({ id }).update({
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
      const { id } = recipeIdParamsSchema.parse(request.params)

      const recipe = await knex('recipes').where('id', id).first()

      if (!recipe) {
        return response.status(404).send({ message: 'Recipe not found' })
      }

      await knex('recipes').delete().where('id', id)

      return response.status(204).send()
    },
  )
}
