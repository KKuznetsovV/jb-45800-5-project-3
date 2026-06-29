import type { NextFunction, Request, Response } from 'express'
import Vacation from '../../models/Vacation'

export default async function getCsv(request: Request, response: Response, next: NextFunction) {
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

        const lines = ['Destination,Likes']
        for (const item of report) {
            // Escape destination in case it contains commas
            const dest = `"${item.destination.replace(/"/g, '""')}"`
            lines.push(`${dest},${item.likesCount}`)
        }

        response.setHeader('Content-Type', 'text/csv')
        response.setHeader('Content-Disposition', 'attachment; filename="Vacation Likes.csv"')
        response.send(lines.join('\n'))
    } catch (err) {
        next(err)
    }
}
