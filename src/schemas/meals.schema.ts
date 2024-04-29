import { z } from 'zod'

export const mealsUpsertBodySchema = z.object({
  name: z.string().min(4),
  description: z.string().min(10),
  isOnDiet: z.boolean(),
  date: z.coerce.date().refine((data) => data < new Date(), {
    message: 'Date should not be in the future',
  }),
})

export const mealIdParamsSchema = z.object({
  id: z.string().uuid(),
})
