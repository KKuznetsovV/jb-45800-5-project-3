import type { NextFunction, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import User from '../../models/User'
import { signToken } from '../../utils/jwt'

export default async function login(request: Request, response: Response, next: NextFunction) {
    try {
        const { email, password } = request.body

        const user = await User.findOne({ email })
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

        const token = signToken({ id: user._id.toString(), role: user.role })

        response.json({
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            },
            token
        })
    } catch (err) {
        next(err)
    }
}
