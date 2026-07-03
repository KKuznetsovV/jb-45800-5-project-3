import type { NextFunction, Request, Response } from 'express'
import config from 'config'
import { minioClient } from '../../utils/image-handler'

const BUCKET = process.env.MINIO_BUCKET || config.get<string>('minio.bucket')

export default async function serveImage(request: Request, response: Response, next: NextFunction) {
    try {
        const { imageName } = request.params
        const stream = await minioClient.getObject(BUCKET, imageName)
        stream.pipe(response)
    } catch {
        next({ status: 404, message: 'Image not found' })
    }
}
