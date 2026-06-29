import type { NextFunction, Request, Response } from 'express'
import { Types } from 'mongoose'
import Like from '../../models/Like'

export default async function unlike(request: Request, response: Response, next: NextFunction) {
    try {
        const { vacationId } = request.params

        if (!Types.ObjectId.isValid(vacationId)) {
            return next({ status: 400, message: 'Invalid vacation id' })
        }

        const deleted = await Like.findOneAndDelete({
            userId:     new Types.ObjectId(request.userId),
            vacationId: new Types.ObjectId(vacationId)
        })

        if (!deleted) return next({ status: 404, message: 'You have not liked this vacation' })

        const likesCount = await Like.countDocuments({ vacationId })
        response.json({ likesCount })
    } catch (err) {
        next(err)
    }
}
