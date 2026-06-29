import type { NextFunction, Request, Response } from 'express'
import { Types } from 'mongoose'
import Vacation from '../../models/Vacation'

const PAGE_SIZE = 9

export default async function getAll(request: Request, response: Response, next: NextFunction) {
    try {
        const page = Math.max(1, parseInt(request.query.page as string) || 1)
        const filter = request.query.filter as string | undefined
        const skip = (page - 1) * PAGE_SIZE
        const userId = new Types.ObjectId(request.userId)
        const now = new Date()

        // Base pipeline: join likes, compute likesCount & isLiked per user
        const basePipeline: any[] = [
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
                    isLiked:    { $in: [userId, '$likes.userId'] }
                }
            },
            { $project: { likes: 0 } }
        ]

        // Apply mutually-exclusive filter
        if (filter === 'liked') {
            basePipeline.push({ $match: { isLiked: true } })
        } else if (filter === 'active') {
            basePipeline.push({ $match: { startDate: { $lte: now }, endDate: { $gte: now } } })
        } else if (filter === 'upcoming') {
            basePipeline.push({ $match: { startDate: { $gt: now } } })
        }

        // $facet: paginated data + total count in one round-trip
        const [result] = await Vacation.aggregate([
            ...basePipeline,
            {
                $facet: {
                    data: [
                        { $sort: { startDate: 1 } },
                        { $skip: skip },
                        { $limit: PAGE_SIZE }
                    ],
                    totalCount: [{ $count: 'count' }]
                }
            }
        ])

        const vacations = result.data
        const total = result.totalCount[0]?.count ?? 0
        const pages = Math.ceil(total / PAGE_SIZE)

        response.json({ vacations, total, page, pages })
    } catch (err) {
        next(err)
    }
}
