import type { NextFunction, Request, Response } from 'express'
import { QueryTypes } from 'sequelize'
import { getSequelize } from '../../db/sequelize'

export default async function getCsv(request: Request, response: Response, next: NextFunction) {
    try {
        const rows = await getSequelize().query<{ destination: string; likesCount: number }>(
            `SELECT v.destination, COUNT(l.id) AS likesCount
             FROM vacations v
             LEFT JOIN likes l ON l.vacationId = v.id
             GROUP BY v.id, v.destination
             ORDER BY v.destination ASC`,
            { type: QueryTypes.SELECT }
        )

        const lines = ['Destination,Likes']
        for (const item of rows) {
            // Escape destination in case it contains commas
            const dest = `"${item.destination.replace(/"/g, '""')}"`
            lines.push(`${dest},${Number(item.likesCount)}`)
        }

        response.setHeader('Content-Type', 'text/csv')
        response.setHeader('Content-Disposition', 'attachment; filename="Vacation Likes.csv"')
        response.send(lines.join('\n'))
    } catch (err) {
        next(err)
    }
}
