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

import { MySqlContainer, StartedMySqlContainer } from '@testcontainers/mysql'
import request from 'supertest'
import bcrypt from 'bcryptjs'
import fs from 'fs'
import path from 'path'
import app from '../app'
import { closeSequelize } from '../db/sequelize'
import { initSchema } from '../db/schema'
import User, { Role } from '../models/User'

let container: StartedMySqlContainer
let userToken: string
let adminToken: string

beforeAll(async () => {
    container = await new MySqlContainer('mysql:8.0').start()
    process.env.VACATIONS_MYSQL_URI = container.getConnectionUri()
    await initSchema()

    // Register regular user
    await request(app).post('/api/auth/register').send({
        firstName: 'Test', lastName: 'User',
        email: 'user@test.com', password: 'User1234',
    })
    const userRes = await request(app).post('/api/auth/login').send({
        email: 'user@test.com', password: 'User1234',
    })
    userToken = userRes.body.token

    // Create admin directly (register always creates role=user)
    const hashed = await bcrypt.hash('Admin1234', 10)
    await User.create({ firstName: 'Admin', lastName: 'Test', email: 'admin@test.com', password: hashed, role: Role.Admin })
    const adminRes = await request(app).post('/api/auth/login').send({
        email: 'admin@test.com', password: 'Admin1234',
    })
    adminToken = adminRes.body.token
}, 120000)

afterAll(async () => {
    // clean up any test images saved to uploads/
    const uploadsDir = path.join(process.cwd(), 'uploads')
    if (fs.existsSync(uploadsDir)) {
        for (const file of fs.readdirSync(uploadsDir)) {
            if (file.startsWith('test-')) fs.unlinkSync(path.join(uploadsDir, file))
        }
    }
    await closeSequelize()
    await container.stop()
})

describe('GET /api/vacations', () => {
    it('returns 401 without auth token', async () => {
        const res = await request(app).get('/api/vacations')
        expect(res.status).toBe(401)
    })

    it('returns 200 with correct pagination structure when authenticated', async () => {
        const res = await request(app)
            .get('/api/vacations')
            .set('Authorization', `Bearer ${userToken}`)
        expect(res.status).toBe(200)
        expect(Array.isArray(res.body.vacations)).toBe(true)
        expect(typeof res.body.total).toBe('number')
        expect(typeof res.body.page).toBe('number')
        expect(typeof res.body.pages).toBe('number')
    })

    it('accepts filter query parameter', async () => {
        const res = await request(app)
            .get('/api/vacations?filter=upcoming&page=1')
            .set('Authorization', `Bearer ${userToken}`)
        expect(res.status).toBe(200)
    })
})

describe('POST /api/vacations', () => {
    it('returns 401 without token', async () => {
        const res = await request(app).post('/api/vacations')
        expect(res.status).toBe(401)
    })

    it('returns 403 for regular user', async () => {
        const res = await request(app)
            .post('/api/vacations')
            .set('Authorization', `Bearer ${userToken}`)
            .field('destination', 'Paris')
            .field('description', 'Beautiful city')
            .field('startDate', '2027-06-01')
            .field('endDate', '2027-06-10')
            .field('price', '999')
            .attach('image', Buffer.from('img'), 'photo.jpg')
        expect(res.status).toBe(403)
    })

    it('returns 422 for admin without image', async () => {
        const res = await request(app)
            .post('/api/vacations')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ destination: 'Paris', description: 'Beautiful city', startDate: '2027-06-01', endDate: '2027-06-10', price: 999 })
        expect(res.status).toBe(422)
    })

    it('returns 201 for admin with valid data and image', async () => {
        const res = await request(app)
            .post('/api/vacations')
            .set('Authorization', `Bearer ${adminToken}`)
            .field('destination', 'Tokyo')
            .field('description', 'An amazing city in Japan with rich culture')
            .field('startDate', '2027-06-01')
            .field('endDate', '2027-06-15')
            .field('price', '1500')
            .attach('image', Buffer.from('fake image bytes'), 'photo.jpg')
        expect(res.status).toBe(201)
        expect(res.body.destination).toBe('Tokyo')
        expect(res.body._id).toBeDefined()
        expect(res.body.imageName).toBeDefined()
    })
})

describe('DELETE /api/vacations/:id', () => {
    let vacationId: string

    beforeAll(async () => {
        const res = await request(app)
            .post('/api/vacations')
            .set('Authorization', `Bearer ${adminToken}`)
            .field('destination', 'DeleteMe')
            .field('description', 'This vacation will be deleted in tests')
            .field('startDate', '2027-07-01')
            .field('endDate', '2027-07-10')
            .field('price', '100')
            .attach('image', Buffer.from('fake'), 'photo.jpg')
        vacationId = res.body._id
    })

    it('returns 401 without token', async () => {
        const res = await request(app).delete(`/api/vacations/${vacationId}`)
        expect(res.status).toBe(401)
    })

    it('returns 403 for regular user', async () => {
        const res = await request(app)
            .delete(`/api/vacations/${vacationId}`)
            .set('Authorization', `Bearer ${userToken}`)
        expect(res.status).toBe(403)
    })

    it('returns 204 for admin', async () => {
        const res = await request(app)
            .delete(`/api/vacations/${vacationId}`)
            .set('Authorization', `Bearer ${adminToken}`)
        expect(res.status).toBe(204)
    })

    it('returns 404 after already deleted', async () => {
        const res = await request(app)
            .delete(`/api/vacations/${vacationId}`)
            .set('Authorization', `Bearer ${adminToken}`)
        expect(res.status).toBe(404)
    })
})
