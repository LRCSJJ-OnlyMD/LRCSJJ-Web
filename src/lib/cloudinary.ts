// Client-side Cloudinary utilities for LRCSJJ platform
// This file only contains client-side functions to avoid Node.js module conflicts

// Simple base64 encoding for temporary solution
export const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })
}

// Client-side upload function using Cloudinary's unsigned upload
export const uploadToCloudinary = async (file: File): Promise<string> => {
  // For now, let's use a simple base64 approach until Cloudinary is properly configured
  // This stores the image as base64 data URL (temporary solution)
  try {
    const base64 = await convertToBase64(file)
    
    // In a real scenario, you would upload to Cloudinary here
    // For now, we'll return the base64 data URL
    console.log('Using base64 storage (temporary). Configure Cloudinary for production.')
    
    return base64
  } catch (error) {
    console.error('Error processing image:', error)
    throw new Error('Failed to process image')
  }
}

// Alternative Cloudinary upload (when properly configured)
export const uploadToCloudinaryReal = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'lrcsjj_unsigned') // You need to create this preset
  formData.append('folder', 'lrcsjj/athletes')

  try {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'LRCSJJ'
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    )

    const data = await response.json()

    if (!response.ok) {
      console.error('Cloudinary error:', data)
      throw new Error(`Upload failed: ${data.error?.message || 'Unknown error'}`)
    }

    return data.secure_url
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error)
    throw error
  }
}

// Helper function to optimize image URLs with Cloudinary transformations
export const getOptimizedImageUrl = (url: string, width = 150, height = 150): string => {
  if (!url) return '/placeholder-avatar.svg'
  
  // If it's a base64 data URL, return as-is
  if (url.startsWith('data:')) return url
  
  // If it's a Cloudinary URL, add transformations
  if (url.includes('cloudinary.com')) {
    const parts = url.split('/upload/')
    if (parts.length === 2) {
      return `${parts[0]}/upload/w_${width},h_${height},c_fill,f_auto,q_auto/${parts[1]}`
    }
  }
  
  return url
}

// Helper function to extract public ID from Cloudinary URL (for future deletion if needed)
export const getCloudinaryPublicId = (url: string): string | null => {
  if (!url || !url.includes('cloudinary.com')) return null
  
  const matches = url.match(/\/([^/]+)\.(jpg|jpeg|png|gif|webp)$/)
  return matches ? matches[1] : null
}
