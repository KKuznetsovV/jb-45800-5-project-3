import type { NextFunction, Request, Response } from 'express'
import { QueryTypes } from 'sequelize'
import { getSequelize } from '../../db/sequelize'

export default async function getReport(request: Request, response: Response, next: NextFunction) {
    try {
        const rows = await getSequelize().query<{ destination: string; likesCount: number }>(
            `SELECT v.destination, COUNT(l.id) AS likesCount
             FROM vacations v
             LEFT JOIN likes l ON l.vacationId = v.id
             GROUP BY v.id, v.destination
             ORDER BY v.destination ASC`,
            { type: QueryTypes.SELECT }
        )

        response.json(rows.map(row => ({ destination: row.destination, likesCount: Number(row.likesCount) })))
    } catch (err) {
        next(err)
    }
}
