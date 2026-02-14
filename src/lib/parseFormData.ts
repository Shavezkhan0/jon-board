export async function parseFormData(request: Request): Promise<{
  fields: Record<string, string>
  file: {
    buffer: Buffer
    filename: string
    mimetype: string
    size: number
  } | null
}> {
  const formData = await request.formData()

  const fields: Record<string, string> = {}
  let file: {
    buffer: Buffer
    filename: string
    mimetype: string
    size: number
  } | null = null

  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      const arrayBuffer = await value.arrayBuffer()
      file = {
        buffer: Buffer.from(arrayBuffer),
        filename: value.name,
        mimetype: value.type,
        size: value.size,
      }
    } else {
      fields[key] = value as string
    }
  }

  return { fields, file }
}

export function validateImageFile(
  file: { mimetype: string; size: number } | null,
  maxSizeMB: number = 5,
): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'No file provided' }
  }

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']

  if (!allowedTypes.includes(file.mimetype)) {
    return {
      valid: false,
      error: 'Invalid file type. Only JPEG, PNG, WebP, GIF allowed.',
    }
  }

  const maxBytes = maxSizeMB * 1024 * 1024
  if (file.size > maxBytes) {
    return {
      valid: false,
      error: `File too large. Maximum size is ${maxSizeMB}MB.`,
    }
  }

  return { valid: true }
}
