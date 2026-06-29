import type { NextFunction, Request, Response } from 'express'
import { Types } from 'mongoose'
import Like from '../../models/Like'
import Vacation from '../../models/Vacation'

export default async function like(request: Request, response: Response, next: NextFunction) {
    try {
        const { vacationId } = request.params

        if (!Types.ObjectId.isValid(vacationId)) {
            return next({ status: 400, message: 'Invalid vacation id' })
        }

        const vacation = await Vacation.findById(vacationId)
        if (!vacation) return next({ status: 404, message: 'Vacation not found' })

        await Like.create({
            userId:     new Types.ObjectId(request.userId),
            vacationId: new Types.ObjectId(vacationId)
        })

        const likesCount = await Like.countDocuments({ vacationId })
        response.status(201).json({ likesCount })
    } catch (err: any) {
        if (err.code === 11000) {
            return next({ status: 409, message: 'You have already liked this vacation' })
        }
        next(err)
    }
}
