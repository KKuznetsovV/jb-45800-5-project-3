import path from 'path'
import { v4 as uuid } from 'uuid'
import { Client } from 'minio'
import config from 'config'
import type { UploadedFile } from 'express-fileupload'

const BUCKET = process.env.MINIO_BUCKET || config.get<string>('minio.bucket')

// useSSL/region are configurable so this client can point at a real remote
// S3-compatible bucket (Cloudflare R2, AWS S3, Backblaze B2, ...) — set
// MINIO_ENDPOINT/PORT/USE_SSL/ACCESS_KEY/SECRET_KEY/BUCKET/REGION in .env.
const useSSL = process.env.MINIO_USE_SSL !== undefined
    ? process.env.MINIO_USE_SSL === 'true'
    : config.get<boolean>('minio.useSSL')
const region = process.env.MINIO_REGION || config.get<string>('minio.region') || undefined

export const minioClient = new Client({
    endPoint:  process.env.MINIO_ENDPOINT  || config.get<string>('minio.endPoint'),
    port:      Number(process.env.MINIO_PORT) || config.get<number>('minio.port'),
    useSSL,
    accessKey: process.env.MINIO_ACCESS_KEY || config.get<string>('minio.accessKey'),
    secretKey: process.env.MINIO_SECRET_KEY || config.get<string>('minio.secretKey'),
    ...(region ? { region } : {}),
})

export async function initBucket(): Promise<void> {
    const exists = await minioClient.bucketExists(BUCKET)
    if (!exists) {
        await minioClient.makeBucket(BUCKET)
    }
}

export async function saveImage(file: UploadedFile): Promise<string> {
    const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        throw { status: 422, message: 'Only JPEG, PNG, WebP, and GIF images are allowed' }
    }
    const ext = path.extname(file.name).toLowerCase()
    const imageName = `${uuid()}${ext}`
    await minioClient.putObject(BUCKET, imageName, file.data, file.size, { 'Content-Type': file.mimetype })
    return imageName
}

export async function deleteImage(imageName: string): Promise<void> {
    try {
        await minioClient.removeObject(BUCKET, imageName)
    } catch {
        // ignore — object may not exist
    }
}
