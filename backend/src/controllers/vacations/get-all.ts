import type { NextFunction, Request, Response } from 'express'
import { QueryTypes } from 'sequelize'
import { getSequelize } from '../../db/sequelize'

const PAGE_SIZE = 9

export default async function getAll(request: Request, response: Response, next: NextFunction) {
    try {
        const page = Math.max(1, parseInt(request.query.page as string) || 1)
        const filter = request.query.filter as string | undefined
        const offset = (page - 1) * PAGE_SIZE
        const userId = Number(request.userId)
        const now = new Date()

        // Mutually-exclusive filter, applied as a WHERE clause
        let whereClause = ''
        const whereParams: any[] = []

        if (filter === 'liked') {
            whereClause = 'WHERE EXISTS (SELECT 1 FROM likes l WHERE l.vacationId = v.id AND l.userId = ?)'
            whereParams.push(userId)
        } else if (filter === 'active') {
            whereClause = 'WHERE v.startDate <= ? AND v.endDate >= ?'
            whereParams.push(now, now)
        } else if (filter === 'upcoming') {
            whereClause = 'WHERE v.startDate > ?'
            whereParams.push(now)
        }

        const sequelize = getSequelize()

        const countRows = await sequelize.query<{ count: number }>(
            `SELECT COUNT(*) AS count FROM vacations v ${whereClause}`,
            { replacements: whereParams, type: QueryTypes.SELECT }
        )
        const total = Number(countRows[0].count)
        const pages = Math.ceil(total / PAGE_SIZE)

        const rows = await sequelize.query<any>(
            `SELECT v.id, v.destination, v.description, v.startDate, v.endDate, v.price, v.imageName,
                    (SELECT COUNT(*) FROM likes l2 WHERE l2.vacationId = v.id) AS likesCount,
                    EXISTS(SELECT 1 FROM likes l3 WHERE l3.vacationId = v.id AND l3.userId = ?) AS isLiked
             FROM vacations v
             ${whereClause}
             ORDER BY v.startDate ASC
             LIMIT ? OFFSET ?`,
            { replacements: [userId, ...whereParams, PAGE_SIZE, offset], type: QueryTypes.SELECT }
        )

        const vacations = rows.map(row => ({
            _id: String(row.id),
            destination: row.destination,
            description: row.description,
            startDate: row.startDate,
            endDate: row.endDate,
            price: Number(row.price),
            imageName: row.imageName,
            likesCount: Number(row.likesCount),
            isLiked: Boolean(row.isLiked)
        }))

        response.json({ vacations, total, page, pages })
    } catch (err) {
        next(err)
    }
}
