jest.mock('openai', () => {
    const MockOpenAI = jest.fn().mockImplementation(() => ({
        chat: { completions: { create: jest.fn() } },
    }))
    return { __esModule: true, default: MockOpenAI, OpenAI: MockOpenAI }
})

import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import request from 'supertest'
import app from '../app'

let mongod: MongoMemoryServer

beforeAll(async () => {
    mongod = await MongoMemoryServer.create()
    await mongoose.connect(mongod.getUri())
})

afterAll(async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    await mongod.stop()
})

// clear users between describe blocks
afterEach(async () => {
    await mongoose.connection.collections.users?.deleteMany({})
})

describe('POST /api/auth/register', () => {
    it('returns 201 with token and user on valid data', async () => {
        const res = await request(app).post('/api/auth/register').send({
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@test.com',
            password: 'Pass1234',
        })
        expect(res.status).toBe(201)
        expect(res.body.token).toBeDefined()
        expect(res.body.user.email).toBe('john@test.com')
        expect(res.body.user.role).toBe('user')
        expect(res.body.user.password).toBeUndefined()
    })

    it('returns 422 on missing required fields', async () => {
        const res = await request(app).post('/api/auth/register').send({
            email: 'missing@test.com',
        })
        expect(res.status).toBe(422)
    })

    it('returns 409 on duplicate email', async () => {
        const body = { firstName: 'A', lastName: 'B', email: 'dup@test.com', password: 'Pass1234' }
        await request(app).post('/api/auth/register').send(body)
        const res = await request(app).post('/api/auth/register').send(body)
        expect(res.status).toBe(409)
    })
})

describe('POST /api/auth/login', () => {
    beforeAll(async () => {
        await request(app).post('/api/auth/register').send({
            firstName: 'Login',
            lastName: 'User',
            email: 'login@test.com',
            password: 'Login1234',
        })
    })

    it('returns 200 with token on valid credentials', async () => {
        const res = await request(app).post('/api/auth/login').send({
            email: 'login@test.com',
            password: 'Login1234',
        })
        expect(res.status).toBe(200)
        expect(res.body.token).toBeDefined()
        expect(res.body.user.email).toBe('login@test.com')
    })

    it('returns 401 on wrong password', async () => {
        const res = await request(app).post('/api/auth/login').send({
            email: 'login@test.com',
            password: 'WrongPass',
        })
        expect(res.status).toBe(401)
    })

    it('returns 401 on non-existent email', async () => {
        const res = await request(app).post('/api/auth/login').send({
            email: 'nobody@test.com',
            password: 'Login1234',
        })
        expect(res.status).toBe(401)
    })

    it('returns 422 on missing fields', async () => {
        const res = await request(app).post('/api/auth/login').send({ email: 'login@test.com' })
        expect(res.status).toBe(422)
    })
})
