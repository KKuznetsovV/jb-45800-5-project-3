import type { NextFunction, Request, Response } from 'express'
import { QueryTypes } from 'sequelize'
import { getSequelize } from '../../db/sequelize'
import { isValidId } from '../../utils/id'

export default async function getOne(request: Request, response: Response, next: NextFunction) {
    try {
        const { id } = request.params

        if (!isValidId(id)) {
            return next({ status: 400, message: 'Invalid vacation id' })
        }

        const userId = Number(request.userId)

        const rows = await getSequelize().query<any>(
            `SELECT v.id, v.destination, v.description, v.startDate, v.endDate, v.price, v.imageName,
                    (SELECT COUNT(*) FROM likes l WHERE l.vacationId = v.id) AS likesCount,
                    EXISTS(SELECT 1 FROM likes l2 WHERE l2.vacationId = v.id AND l2.userId = ?) AS isLiked
             FROM vacations v
             WHERE v.id = ?`,
            { replacements: [userId, id], type: QueryTypes.SELECT }
        )

        const row = rows[0]
        if (!row) return next({ status: 404, message: 'Vacation not found' })

        response.json({
            _id: String(row.id),
            destination: row.destination,
            description: row.description,
            startDate: row.startDate,
            endDate: row.endDate,
            price: Number(row.price),
            imageName: row.imageName,
            likesCount: Number(row.likesCount),
            isLiked: Boolean(row.isLiked)
        })
    } catch (err) {
        next(err)
    }
}
