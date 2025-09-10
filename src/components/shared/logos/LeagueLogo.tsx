'use client'

import { cn } from '@/lib/utils'
import Image from 'next/image'
import { LOGO_PATHS, LOGO_SIZES } from '@/config/logos'
import { useState } from 'react'

interface LeagueLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  showText?: boolean
}

const sizeClasses = {
  sm: 'w-6 h-6', // 24px
  md: 'w-8 h-8', // 32px
  lg: 'w-12 h-12', // 48px
  xl: 'w-16 h-16', // 64px
}

const textSizeClasses = {
  sm: 'text-sm',
  md: 'text-lg',
  lg: 'text-xl',
  xl: 'text-2xl',
}

export function LeagueLogo({ size = 'md', className, showText = false }: LeagueLogoProps) {
  const logoSize = LOGO_SIZES[size]
  const [imageError, setImageError] = useState(false)
  
  return (
    <div className={cn('flex items-center space-x-2', className)}>
      {/* Try to load actual logo, fall back to placeholder */}
      <div className={cn(
        'relative bg-gradient-to-r from-[#d62027] to-[#017444] rounded-full flex items-center justify-center overflow-hidden',
        sizeClasses[size]
      )}>
        {!imageError && (
          <Image
            src={LOGO_PATHS.league.main}
            alt="Casablanca-Settat Ju-Jitsu League Logo"
            width={logoSize.width}
            height={logoSize.height}
            className="object-contain"
            onError={() => setImageError(true)}
          />
        )}
      </div>
      
      {showText && (
        <span className={cn(
          'font-bold text-gray-900',
          textSizeClasses[size]
        )}>
          LRCSJJ
        </span>
      )}
    </div>
  )
}
