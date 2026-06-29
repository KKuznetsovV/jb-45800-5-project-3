import type { NextFunction, Request, Response } from 'express'

export default function roleEnforce(role: string) {
    return (request: Request, response: Response, next: NextFunction) => {
        if (request.userRole !== role) {
            return next({ status: 403, message: 'Access denied' })
        }
        next()
    }
}
