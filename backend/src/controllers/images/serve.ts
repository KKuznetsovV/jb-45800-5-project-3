import type { NextFunction, Request, Response } from 'express'
import config from 'config'
import { minioClient } from '../../utils/image-handler'

const BUCKET = process.env.MINIO_BUCKET || config.get<string>('minio.bucket')
const SAFE_IMAGE_NAME = /^[\w-]+\.[a-zA-Z]{3,4}$/

export default async function serveImage(request: Request, response: Response, next: NextFunction) {
    try {
        const { imageName } = request.params
        if (!SAFE_IMAGE_NAME.test(imageName)) {
            return next({ status: 400, message: 'Invalid image name' })
        }
        const stream = await minioClient.getObject(BUCKET, imageName)
        stream.pipe(response)
    } catch {
        next({ status: 404, message: 'Image not found' })
    }
}
