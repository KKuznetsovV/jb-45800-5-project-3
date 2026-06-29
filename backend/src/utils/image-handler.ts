import path from 'path'
import fs from 'fs'
import { v4 as uuid } from 'uuid'
import type { UploadedFile } from 'express-fileupload'

export async function saveImage(file: UploadedFile): Promise<string> {
    const ext = path.extname(file.name).toLowerCase()
    const imageName = `${uuid()}${ext}`
    await file.mv(`./uploads/${imageName}`)
    return imageName
}

export function deleteImage(imageName: string): void {
    const imagePath = `./uploads/${imageName}`
    if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath)
    }
}
