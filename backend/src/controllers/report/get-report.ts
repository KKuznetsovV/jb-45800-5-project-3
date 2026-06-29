import type { NextFunction, Request, Response } from 'express'
import Vacation from '../../models/Vacation'

export default async function getReport(request: Request, response: Response, next: NextFunction) {
    try {
        const report = await Vacation.aggregate([
            {
                $lookup: {
                    from: 'likes',
                    localField: '_id',
                    foreignField: 'vacationId',
                    as: 'likes'
                }
            },
            {
                $project: {
                    destination: 1,
                    likesCount: { $size: '$likes' }
                }
            },
            { $sort: { destination: 1 } }
        ])

        response.json(report)
    } catch (err) {
        next(err)
    }
}
