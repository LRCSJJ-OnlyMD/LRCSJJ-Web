'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { uploadToCloudinary, getOptimizedImageUrl } from '@/lib/cloudinary'
import { Upload, X, Camera } from 'lucide-react'

interface ImageUploadProps {
  currentImageUrl?: string
  onImageChange: (imageUrl: string | null) => void
  label?: string
  disabled?: boolean
}

export default function ImageUpload({ 
  currentImageUrl, 
  onImageChange, 
  label = "Photo de l'athlète",
  disabled = false 
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image valide.')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Le fichier ne doit pas dépasser 5MB.')
      return
    }

    setIsUploading(true)

    try {
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string)
      }
      reader.readAsDataURL(file)

      // Upload to Cloudinary
      const imageUrl = await uploadToCloudinary(file)
      onImageChange(imageUrl)
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Erreur lors du téléchargement de l\'image. Veuillez réessayer.')
      setPreviewUrl(currentImageUrl || null)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setPreviewUrl(null)
    onImageChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleButtonClick = () => {
    if (disabled) return
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      
      <div className="flex items-center space-x-4">
        {/* Image Preview */}
        <div className="relative">
          <div className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden bg-gray-50 flex items-center justify-center">
            {previewUrl ? (
              <Image
                src={getOptimizedImageUrl(previewUrl, 96, 96)}
                alt="Preview"
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            ) : (
              <Camera className="w-8 h-8 text-gray-400" />
            )}
          </div>
          
          {previewUrl && !disabled && (
            <button
              type="button"
              onClick={handleRemoveImage}
              title="Supprimer la photo"
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              disabled={isUploading}
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Upload Controls */}
        <div className="flex-1 space-y-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleButtonClick}
            disabled={disabled || isUploading}
            className="w-full"
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2" />
                Téléchargement...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                {previewUrl ? 'Changer la photo' : 'Télécharger une photo'}
              </>
            )}
          </Button>
          
          <p className="text-xs text-gray-500">
            JPG, PNG ou WEBP. Max 5MB.
          </p>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
        aria-label="Sélectionner une image"
        title="Sélectionner une image"
      />
    </div>
  )
}
