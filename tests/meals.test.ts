import { execSync } from 'child_process'
import request from 'supertest'
import { app } from '../src/app'
import { describe, beforeAll, afterAll, beforeEach, it, expect } from 'vitest'

describe('Meals route', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able to create a new meal', async () => {
    const userResponse = await request(app.server)
      .post('/users')
      .send({ name: 'Test User', email: 'user@test.com' })
      .expect(201)

    await request(app.server)
      .post('/meals')
      .set('Cookie', userResponse.get('Set-Cookie') as string[])
      .send({
        name: 'Test Meal',
        description: 'This is a test meal',
        isOnDiet: true,
        date: new Date(),
      })
      .expect(201)
  })
})
