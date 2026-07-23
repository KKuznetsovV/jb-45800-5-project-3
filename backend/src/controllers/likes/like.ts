import type { NextFunction, Request, Response } from 'express'
import Like from '../../models/Like'
import Vacation from '../../models/Vacation'
import { isValidId } from '../../utils/id'

export default async function like(request: Request, response: Response, next: NextFunction) {
    try {
        const { vacationId } = request.params

        if (!isValidId(vacationId)) {
            return next({ status: 400, message: 'Invalid vacation id' })
        }

        const vacation = await Vacation.findById(vacationId)
        if (!vacation) return next({ status: 404, message: 'Vacation not found' })

        await Like.create({
            userId:     Number(request.userId),
            vacationId: Number(vacationId)
        })

        const likesCount = await Like.countByVacationId(vacationId)
        response.status(201).json({ likesCount })
    } catch (err: any) {
        if (err.code === 'ER_DUP_ENTRY') {
            return next({ status: 409, message: 'You have already liked this vacation' })
        }
        next(err)
    }
}
