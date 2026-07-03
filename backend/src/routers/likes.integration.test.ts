jest.mock('openai', () => {
    const MockOpenAI = jest.fn().mockImplementation(() => ({
        chat: { completions: { create: jest.fn() } },
    }))
    return { __esModule: true, default: MockOpenAI, OpenAI: MockOpenAI }
})

jest.mock('../utils/image-handler', () => ({
    saveImage: jest.fn().mockResolvedValue('test-vacation.jpg'),
    deleteImage: jest.fn(),
}))

import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import request from 'supertest'
import bcrypt from 'bcryptjs'
import app from '../app'
import User, { Role } from '../models/User'

let mongod: MongoMemoryServer
let userToken: string
let adminToken: string
let vacationId: string

beforeAll(async () => {
    mongod = await MongoMemoryServer.create()
    await mongoose.connect(mongod.getUri())

    // Regular user
    await request(app).post('/api/auth/register').send({
        firstName: 'Like', lastName: 'User',
        email: 'like@test.com', password: 'Like1234',
    })
    const userRes = await request(app).post('/api/auth/login').send({
        email: 'like@test.com', password: 'Like1234',
    })
    userToken = userRes.body.token

    // Admin user
    const hashed = await bcrypt.hash('Admin1234', 10)
    await User.create({ firstName: 'Admin', lastName: 'Test', email: 'admin@test.com', password: hashed, role: Role.Admin })
    const adminRes = await request(app).post('/api/auth/login').send({
        email: 'admin@test.com', password: 'Admin1234',
    })
    adminToken = adminRes.body.token

    // Create a vacation to test liking
    const vacRes = await request(app)
        .post('/api/vacations')
        .set('Authorization', `Bearer ${adminToken}`)
        .field('destination', 'LikeCity')
        .field('description', 'A great place to test likes')
        .field('startDate', '2027-08-01')
        .field('endDate', '2027-08-10')
        .field('price', '500')
        .attach('image', Buffer.from('fake image'), 'photo.jpg')
    vacationId = vacRes.body._id
})

afterAll(async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    await mongod.stop()
})

describe('POST /api/likes/:vacationId', () => {
    it('returns 401 without token', async () => {
        const res = await request(app).post(`/api/likes/${vacationId}`)
        expect(res.status).toBe(401)
    })

    it('returns 201 and likesCount=1 on first like', async () => {
        const res = await request(app)
            .post(`/api/likes/${vacationId}`)
            .set('Authorization', `Bearer ${userToken}`)
        expect(res.status).toBe(201)
        expect(res.body.likesCount).toBe(1)
    })

    it('returns 409 on duplicate like', async () => {
        const res = await request(app)
            .post(`/api/likes/${vacationId}`)
            .set('Authorization', `Bearer ${userToken}`)
        expect(res.status).toBe(409)
    })
})

describe('DELETE /api/likes/:vacationId', () => {
    it('returns 401 without token', async () => {
        const res = await request(app).delete(`/api/likes/${vacationId}`)
        expect(res.status).toBe(401)
    })

    it('returns 200 and likesCount=0 after unliking', async () => {
        const res = await request(app)
            .delete(`/api/likes/${vacationId}`)
            .set('Authorization', `Bearer ${userToken}`)
        expect(res.status).toBe(200)
        expect(res.body.likesCount).toBe(0)
    })

    it('returns 404 when trying to unlike a vacation not liked', async () => {
        const res = await request(app)
            .delete(`/api/likes/${vacationId}`)
            .set('Authorization', `Bearer ${userToken}`)
        expect(res.status).toBe(404)
    })
})
