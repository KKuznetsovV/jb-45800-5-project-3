import type { NextFunction, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import User, { toJSON } from '../../models/User'
import { signToken } from '../../utils/jwt'

export default async function login(request: Request, response: Response, next: NextFunction) {
    try {
        const { email, password } = request.body

        const user = await User.findByEmail(email)
        if (!user) {
            return next({ status: 401, message: 'Incorrect email or password' })
        }

        if (!user.password) {
            return next({ status: 401, message: 'This account uses Google sign-in. Please use the Google button.' })
        }

        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) {
            return next({ status: 401, message: 'Incorrect email or password' })
        }

        const token = signToken({ id: String(user.id), role: user.role })

        response.json({
            user: toJSON(user),
            token
        })
    } catch (err) {
        next(err)
    }
}
