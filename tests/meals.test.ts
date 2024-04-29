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

  it('should be able to list all meals from a user', async () => {
    const userResponse = await request(app.server)
      .post('/users')
      .send({ name: 'Test User', email: 'user@test.com' })
      .expect(201)

    await request(app.server)
      .post('/meals')
      .set('Cookie', userResponse.get('Set-Cookie') as string[])
      .send({
        name: 'Test Meal 1',
        description: 'This is the test meal 1',
        isOnDiet: true,
        date: new Date(),
      })
      .expect(201)

    await request(app.server)
      .post('/meals')
      .set('Cookie', userResponse.get('Set-Cookie') as string[])
      .send({
        name: 'Test Meal 2',
        description: 'This is the test meal 2',
        isOnDiet: true,
        date: new Date(),
      })
      .expect(201)

    const mealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', userResponse.get('Set-Cookie') as string[])
      .expect(200)

    expect(mealsResponse.body.meals).toHaveLength(2)
    expect(mealsResponse.body.meals[0].name).toBe('Test Meal 1')
    expect(mealsResponse.body.meals[1].name).toBe('Test Meal 2')
  })

  it('should be able to list a single meal', async () => {
    const userResponse = await request(app.server)
      .post('/users')
      .send({ name: 'Test User', email: 'user@test.com' })
      .expect(201)

    await request(app.server)
      .post('/meals')
      .set('Cookie', userResponse.get('Set-Cookie') as string[])
      .send({
        name: 'Test Meal 1',
        description: 'This is the test meal 1',
        isOnDiet: true,
        date: new Date(),
      })
      .expect(201)

    const mealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', userResponse.get('Set-Cookie') as string[])
      .expect(200)

    const mealResponse = await request(app.server)
      .get(`/meals/${mealsResponse.body.meals[0].id}`)
      .set('Cookie', userResponse.get('Set-Cookie') as string[])
      .expect(200)

    expect(mealResponse.body).toEqual({
      meal: expect.objectContaining({
        name: 'Test Meal 1',
        description: 'This is the test meal 1',
        is_on_diet: 1,
        date: expect.any(Number),
      }),
    })
  })

  it('should be able to delete a meal', async () => {
    const userResponse = await request(app.server)
      .post('/users')
      .send({ name: 'Test User', email: 'user@test.com' })
      .expect(201)

    await request(app.server)
      .post('/meals')
      .set('Cookie', userResponse.get('Set-Cookie') as string[])
      .send({
        name: 'Test Meal 1',
        description: 'This is the test meal 1',
        isOnDiet: true,
        date: new Date(),
      })
      .expect(201)

    const mealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', userResponse.get('Set-Cookie') as string[])
      .expect(200)

    await request(app.server)
      .delete(`/meals/${mealsResponse.body.meals[0].id}`)
      .set('Cookie', userResponse.get('Set-Cookie') as string[])
      .expect(204)
  })

  it('should be able to update a meal', async () => {
    const userResponse = await request(app.server)
      .post('/users')
      .send({ name: 'Test User', email: 'user@test.com' })
      .expect(201)

    await request(app.server)
      .post('/meals')
      .set('Cookie', userResponse.get('Set-Cookie') as string[])
      .send({
        name: 'Test Meal 1',
        description: 'This is the test meal 1',
        isOnDiet: true,
        date: new Date(),
      })
      .expect(201)

    const mealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', userResponse.get('Set-Cookie') as string[])
      .expect(200)

    const mealId = mealsResponse.body.meals[0].id

    await request(app.server)
      .put(`/meals/${mealId}`)
      .set('Cookie', userResponse.get('Set-Cookie') as string[])
      .send({
        name: 'Test Meal 2',
        description: 'This is the test meal 2',
        isOnDiet: true,
        date: new Date(),
      })
      .expect(204)
  })
})
