import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('recipes', (table) => {
    table.uuid('id').primary()
    table.uuid('user_id').references('id').inTable('users').notNullable()
    table.string('name').notNullable()
    table.string('description').notNullable()
    table.boolean('is_on_diet').notNullable()
    table.date('date').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('recipes')
}
