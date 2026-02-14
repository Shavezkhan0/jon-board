import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export default cloudinary

export async function uploadProfilePhoto(
  file: Buffer,
  userId: string,
  previousPublicId?: string,
): Promise<{
  url: string
  publicId: string
  width: number
  height: number
}> {
  if (previousPublicId) {
    try {
      await cloudinary.uploader.destroy(previousPublicId)
    } catch (e) {
      console.error('Failed to delete old photo:', e)
    }
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'jobboard/profiles',
        public_id: `user_${userId}_${Date.now()}`,
        transformation: [
          { width: 400, height: 400, crop: 'fill', gravity: 'face' },
          { quality: 'auto', fetch_format: 'auto' },
        ],
        overwrite: true,
      },
      (error, result) => {
        if (error) reject(error)
        else
          resolve({
            url: result!.secure_url,
            publicId: result!.public_id,
            width: result!.width,
            height: result!.height,
          })
      },
    )
    uploadStream.end(file)
  })
}

export async function uploadCompanyLogo(
  file: Buffer,
  company: string,
  previousPublicId?: string,
): Promise<{
  url: string
  publicId: string
  width: number
  height: number
}> {
  if (previousPublicId) {
    try {
      await cloudinary.uploader.destroy(previousPublicId)
    } catch (e) {
      console.error('Failed to delete old logo:', e)
    }
  }

  const safeCompanyName = company
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .substring(0, 30)

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'jobboard/logos',
        public_id: `logo_${safeCompanyName}_${Date.now()}`,
        transformation: [
          { width: 300, height: 300, crop: 'pad', background: 'white' },
          { quality: 'auto', fetch_format: 'auto' },
        ],
        overwrite: true,
      },
      (error, result) => {
        if (error) reject(error)
        else
          resolve({
            url: result!.secure_url,
            publicId: result!.public_id,
            width: result!.width,
            height: result!.height,
          })
      },
    )
    uploadStream.end(file)
  })
}

export async function uploadMedia(
  file: Buffer,
  folder: string,
  filename: string,
  previousPublicId?: string,
): Promise<{
  url: string
  publicId: string
  width: number
  height: number
  format: string
  bytes: number
}> {
  if (previousPublicId) {
    try {
      await cloudinary.uploader.destroy(previousPublicId)
    } catch (e) {
      console.error('Failed to delete old media:', e)
    }
  }

  const safeName = filename
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .substring(0, 50)

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `jobboard/${folder}`,
        public_id: `${safeName}_${Date.now()}`,
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      },
      (error, result) => {
        if (error) reject(error)
        else
          resolve({
            url: result!.secure_url,
            publicId: result!.public_id,
            width: result!.width,
            height: result!.height,
            format: result!.format,
            bytes: result!.bytes,
          })
      },
    )
    uploadStream.end(file)
  })
}

export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  try {
    await cloudinary.uploader.destroy(publicId)
    return true
  } catch (e) {
    console.error('Delete from cloudinary failed:', e)
    return false
  }
}

export function getOptimizedUrl(
  publicId: string,
  options: {
    width?: number
    height?: number
    crop?: string
    quality?: string | number
  } = {},
): string {
  return cloudinary.url(publicId, {
    secure: true,
    quality: options.quality || 'auto',
    fetch_format: 'auto',
    width: options.width,
    height: options.height,
    crop: options.crop || 'fill',
  })
}
