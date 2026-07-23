import type { NextFunction, Request, Response } from 'express'
import Vacation from '../../models/Vacation'
import Like from '../../models/Like'
import { deleteImage } from '../../utils/image-handler'
import { isValidId } from '../../utils/id'

export default async function remove(request: Request, response: Response, next: NextFunction) {
    try {
        const { id } = request.params

        if (!isValidId(id)) {
            return next({ status: 400, message: 'Invalid vacation id' })
        }

        const vacation = await Vacation.findById(id)
        if (!vacation) return next({ status: 404, message: 'Vacation not found' })

        // Delete image file, all likes, then the vacation
        await deleteImage(vacation.imageName)
        await Like.deleteByVacationId(vacation.id)
        await Vacation.deleteById(vacation.id)

        response.sendStatus(204)
    } catch (err) {
        next(err)
    }
}
