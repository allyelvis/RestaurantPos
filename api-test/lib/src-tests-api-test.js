import request from 'supertest'
import app from '../server.js'

describe('API Tests', () => {
  it('GET /api/users should return users', async () => {
    const res = await request(app).get('/api/users')
    expect(res.statusCode).toEqual(200)
    expect(Array.isArray(res.body)).toBeTruthy()
  })

  it('POST /api/users should create a new user', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({
        username: 'testuser',
        password: 'testpassword',
        role: 'waiter'
      })
    expect(res.statusCode).toEqual(201)
    expect(res.body).toHaveProperty('id')
  })

  // Add more tests for other endpoints
})