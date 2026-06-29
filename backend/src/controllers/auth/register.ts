import type { NextFunction, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import User, { Role } from '../../models/User'
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

        const token = signToken({ id: user._id.toString(), role: user.role })

        response.status(201).json({
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            },
            token
        })
    } catch (err: any) {
        // MongoDB duplicate key error (unique index on email)
        if (err.code === 11000) {
            return next({ status: 409, message: 'Email is already registered' })
        }
        next(err)
    }
}
