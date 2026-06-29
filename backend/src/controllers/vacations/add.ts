import type { NextFunction, Request, Response } from 'express'
import type { UploadedFile } from 'express-fileupload'
import Vacation from '../../models/Vacation'
import { saveImage } from '../../utils/image-handler'

export default async function add(request: Request, response: Response, next: NextFunction) {
    try {
        const image = request.files?.image as UploadedFile | undefined
        if (!image) return next({ status: 422, message: 'Vacation image is required' })

        const imageName = await saveImage(image)

        const vacation = await Vacation.create({
            ...request.body,
            imageName
        })

        response.status(201).json(vacation)
    } catch (err) {
        next(err)
    }
}
