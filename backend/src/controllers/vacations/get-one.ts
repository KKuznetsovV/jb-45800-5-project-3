import type { NextFunction, Request, Response } from 'express'
import { Types } from 'mongoose'
import Vacation from '../../models/Vacation'

export default async function getOne(request: Request, response: Response, next: NextFunction) {
    try {
        const { id } = request.params

        if (!Types.ObjectId.isValid(id)) {
            return next({ status: 400, message: 'Invalid vacation id' })
        }

        const [result] = await Vacation.aggregate([
            { $match: { _id: new Types.ObjectId(id) } },
            {
                $lookup: {
                    from: 'likes',
                    localField: '_id',
                    foreignField: 'vacationId',
                    as: 'likes'
                }
            },
            {
                $addFields: {
                    likesCount: { $size: '$likes' },
                    isLiked:    { $in: [new Types.ObjectId(request.userId), '$likes.userId'] }
                }
            },
            { $project: { likes: 0 } }
        ])

        if (!result) return next({ status: 404, message: 'Vacation not found' })

        response.json(result)
    } catch (err) {
        next(err)
    }
}
