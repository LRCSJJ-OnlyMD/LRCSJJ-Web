'use client'

import { cn } from '@/lib/utils'
import Image from 'next/image'
import { useState } from 'react'

interface PersonAvatarProps {
  name: string
  role: string
  initials: string
  imageUrl?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  colorScheme?: 'red' | 'green' | 'blue' | 'gold' | 'purple'
}

const sizeClasses = {
  sm: 'w-16 h-16', // 64px
  md: 'w-20 h-20', // 80px
  lg: 'w-32 h-32', // 128px
  xl: 'w-40 h-40', // 160px
}

const textSizeClasses = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-4xl',
  xl: 'text-5xl',
}

const colorSchemes = {
  red: 'from-[#d62027] to-red-600',
  green: 'from-[#017444] to-green-600',
  blue: 'from-blue-500 to-blue-600',
  gold: 'from-yellow-400 to-yellow-600',
  purple: 'from-purple-500 to-purple-600',
}

export function PersonAvatar({ 
  name, 
  role, 
  initials, 
  imageUrl, 
  size = 'lg', 
  className,
  colorScheme = 'red'
}: PersonAvatarProps) {
  const [imageError, setImageError] = useState(false)
  
  return (
    <div className={cn('flex flex-col items-center text-center', className)}>
      {/* Avatar image or initials */}
      <div className={cn(
        'rounded-full flex items-center justify-center overflow-hidden',
        sizeClasses[size],
        (!imageUrl || imageError) && `bg-gradient-to-r ${colorSchemes[colorScheme]}`
      )}>
        {imageUrl && !imageError ? (
          <Image
            src={imageUrl}
            alt={`${name} - ${role}`}
            width={size === 'xl' ? 160 : size === 'lg' ? 128 : size === 'md' ? 80 : 64}
            height={size === 'xl' ? 160 : size === 'lg' ? 128 : size === 'md' ? 80 : 64}
            className="object-cover w-full h-full"
            onError={() => setImageError(true)}
          />
        ) : (
          <span className={cn(
            'text-white font-bold',
            textSizeClasses[size]
          )}>
            {initials}
          </span>
        )}
      </div>
      
      {/* Person info */}
      <div className="mt-4">
        <h3 className={cn(
          'font-bold text-foreground',
          size === 'sm' ? 'text-sm' : 
          size === 'md' ? 'text-base' : 
          size === 'lg' ? 'text-lg' : 'text-xl'
        )}>
          {name}
        </h3>
        <p className={cn(
          'text-muted-foreground',
          size === 'sm' ? 'text-xs' : 'text-sm'
        )}>
          {role}
        </p>
      </div>
    </div>
  )
}
