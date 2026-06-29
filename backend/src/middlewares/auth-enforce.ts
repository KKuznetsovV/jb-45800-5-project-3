import type { NextFunction, Request, Response } from 'express'
import { verify } from 'jsonwebtoken'
import config from 'config'

declare global {
    namespace Express {
        interface Request {
            userId: string
            userRole: string
        }
    }
}

export default function authEnforce(request: Request, response: Response, next: NextFunction) {
    const authHeader = request.get('Authorization')

    if (!authHeader) return next({ status: 401, message: 'Authorization header is missing' })

    if (!authHeader.startsWith('Bearer')) return next({ status: 401, message: 'Invalid authorization scheme' })

    const [, jwt] = authHeader.split(' ')

    if (!jwt) return next({ status: 401, message: 'Token is missing' })

    try {
        const key = config.get<string>('app.encryptionKey')
        const payload = verify(jwt, key) as { id: string; role: string }
        request.userId = payload.id
        request.userRole = payload.role
        next()
    } catch {
        next({ status: 401, message: 'Invalid or expired token' })
    }
}
