import type { NextFunction, Request, Response } from 'express'
import { ObjectSchema } from 'joi'

export default function bodyValidation(validator: ObjectSchema) {
    return async (request: Request, response: Response, next: NextFunction) => {
        try {
            request.body = await validator.validateAsync(request.body)
            next()
        } catch (e: any) {
            next({ status: 422, message: e.message || 'Unprocessable entity' })
        }
    }
}
