import { app } from '../src/app'
import { describe, beforeAll, afterAll, beforeEach, it, expect } from 'vitest'
import { execSync } from 'child_process'
import request from 'supertest'

describe('Users route', () => {
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

  it('should be able to create a new user', async () => {
    const response = await request(app.server)
      .post('/users')
      .send({ name: 'User Test', email: 'usertest@test.com' })

    expect(response.status).toEqual(201)

    const cookies = response.get('Set-Cookie')

    expect(cookies).toEqual(
      expect.arrayContaining([expect.stringContaining('sessionId')]),
    )
  })
})
