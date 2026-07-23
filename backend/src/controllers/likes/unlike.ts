import type { NextFunction, Request, Response } from 'express'
import Like from '../../models/Like'
import { isValidId } from '../../utils/id'

export default async function unlike(request: Request, response: Response, next: NextFunction) {
    try {
        const { vacationId } = request.params

        if (!isValidId(vacationId)) {
            return next({ status: 400, message: 'Invalid vacation id' })
        }

        const deleted = await Like.deleteOne({
            userId:     Number(request.userId),
            vacationId: Number(vacationId)
        })

        if (!deleted) return next({ status: 404, message: 'You have not liked this vacation' })

        const likesCount = await Like.countByVacationId(vacationId)
        response.json({ likesCount })
    } catch (err) {
        next(err)
    }
}
