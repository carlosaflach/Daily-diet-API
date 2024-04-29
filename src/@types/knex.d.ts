// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      name: string
      email: string
      created_at: string
      session_id?: string
    }
    recipes: {
      id: string
      user_id: string
      name: string
      is_on_diet: boolean
      description: string
      created_at: string
      date: Date
    }
  }
}
