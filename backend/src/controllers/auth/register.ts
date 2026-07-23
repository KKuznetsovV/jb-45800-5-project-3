import type { NextFunction, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import User, { Role, toJSON } from '../../models/User'
import { signToken } from '../../utils/jwt'

export default async function register(request: Request, response: Response, next: NextFunction) {
    try {
        const { firstName, lastName, email, password } = request.body

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role: Role.User
        })

        const token = signToken({ id: String(user.id), role: user.role })

        response.status(201).json({
            user: toJSON(user),
            token
        })
    } catch (err: any) {
        // MySQL duplicate key error (unique index on email)
        if (err.code === 'ER_DUP_ENTRY') {
            return next({ status: 409, message: 'Email is already registered' })
        }
        next(err)
    }
}
