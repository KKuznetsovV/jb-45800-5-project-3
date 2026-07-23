import type { NextFunction, Request, Response } from 'express'
import type { UploadedFile } from 'express-fileupload'
import Vacation, { toJSON } from '../../models/Vacation'
import { saveImage, deleteImage } from '../../utils/image-handler'
import { isValidId } from '../../utils/id'

export default async function update(request: Request, response: Response, next: NextFunction) {
    try {
        const { id } = request.params

        if (!isValidId(id)) {
            return next({ status: 400, message: 'Invalid vacation id' })
        }

        const existing = await Vacation.findById(id)
        if (!existing) return next({ status: 404, message: 'Vacation not found' })

        const updateData: any = { ...request.body }

        // Replace image only if a new one was uploaded
        const newImage = request.files?.image as UploadedFile | undefined
        if (newImage) {
            await deleteImage(existing.imageName)
            updateData.imageName = await saveImage(newImage)
        }

        const vacation = await Vacation.update(existing.id, updateData)

        response.json(toJSON(vacation!))
    } catch (err) {
        next(err)
    }
}
