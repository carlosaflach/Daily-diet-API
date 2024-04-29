import { z } from 'zod'

export const recipesUpsertBodySchema = z.object({
  name: z.string().min(4),
  description: z.string().min(10),
  isOnDiet: z.boolean(),
  date: z.coerce.date().refine((data) => data < new Date(), {
    message: 'Date should not be in the future',
  }),
})

export const recipeIdParamsSchema = z.object({
  id: z.string().uuid(),
})
