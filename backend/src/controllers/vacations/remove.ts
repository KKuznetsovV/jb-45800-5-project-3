import type { NextFunction, Request, Response } from 'express'
import { Types } from 'mongoose'
import Vacation from '../../models/Vacation'
import Like from '../../models/Like'
import { deleteImage } from '../../utils/image-handler'

export default async function remove(request: Request, response: Response, next: NextFunction) {
    try {
        const { id } = request.params

        if (!Types.ObjectId.isValid(id)) {
            return next({ status: 400, message: 'Invalid vacation id' })
        }

        const vacation = await Vacation.findById(id)
        if (!vacation) return next({ status: 404, message: 'Vacation not found' })

        // Delete image file, all likes, then the vacation
        deleteImage(vacation.imageName)
        await Like.deleteMany({ vacationId: new Types.ObjectId(id) })
        await vacation.deleteOne()

        response.sendStatus(204)
    } catch (err) {
        next(err)
    }
}
