'use client'

import { cn } from '@/lib/utils'
import Image from 'next/image'
import { LOGO_PATHS, LOGO_SIZES } from '@/config/logos'
import { useState } from 'react'

interface FederationLogoProps {
  type?: 'main' | 'northAfrica' | 'africa' | 'jjif'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  showLabel?: boolean
}

const sizeClasses = {
  sm: 'w-8 h-8', // 32px
  md: 'w-12 h-12', // 48px
  lg: 'w-16 h-16', // 64px
  xl: 'w-20 h-20', // 80px
}

const federationData = {
  morocco: {
    name: 'Royal Moroccan Federation',
    shortName: 'FRMJJ',
    fullName: 'Fédération Royale Marocaine de Ju-Jitsu',
    color: 'bg-red-600',
    initials: 'MA'
  },
  'north-africa': {
    name: 'North African Union',
    shortName: 'UNAJJ',
    fullName: 'North African Union of Ju-Jitsu',
    color: 'bg-green-600',
    initials: 'NA'
  },
  africa: {
    name: 'African Union',
    shortName: 'UAJJ',
    fullName: 'African Union of Ju-Jitsu',
    color: 'bg-yellow-600',
    initials: 'AU'
  },
  jjif: {
    name: 'International Federation',
    shortName: 'JJIF',
    fullName: 'Ju-Jitsu International Federation',
    color: 'bg-blue-600',
    initials: 'IF'
  }
}

export function FederationLogo({ type = 'main', size = 'md', className, showLabel = false }: FederationLogoProps) {
  const logoSize = LOGO_SIZES[size]
  const [imageError, setImageError] = useState(false)
  
  // Map federation types to logo paths and data
  const getLogoConfig = () => {
    switch(type) {
      case 'main':
        return {
          path: LOGO_PATHS.federation.main,
          data: federationData.morocco
        }
      case 'northAfrica':
        return {
          path: LOGO_PATHS.federation.northAfrica,
          data: federationData['north-africa']
        }
      case 'africa':
        return {
          path: LOGO_PATHS.federation.africa,
          data: federationData.africa
        }
      case 'jjif':
        return {
          path: LOGO_PATHS.federation.jjif,
          data: federationData.jjif
        }
      default:
        return {
          path: LOGO_PATHS.federation.main,
          data: federationData.morocco
        }
    }
  }
  
  const { path: logoPath, data } = getLogoConfig()
  
  return (
    <div className={cn('flex flex-col items-center text-center', className)}>
      {/* Try to load actual federation logo, fall back to placeholder */}
      <div className={cn(
        'relative rounded-lg flex items-center justify-center overflow-hidden',
        sizeClasses[size]
      )}>
        {!imageError && (
          <Image
            src={logoPath}
            alt={`${data.name} Logo`}
            width={logoSize.width}
            height={logoSize.height}
            className="object-contain w-full h-full"
            onError={() => {
              console.warn(`Failed to load federation logo: ${logoPath}`)
              setImageError(true)
            }}
            priority={size === 'lg' || size === 'xl'}
          />
        )}
        
        {/* Fallback placeholder - only show if image failed to load */}
        {imageError && (
          <div className={cn(
            'w-full h-full flex items-center justify-center text-white font-bold',
            data.color
          )}>
            <span className={cn(
              size === 'sm' ? 'text-xs' : 
              size === 'md' ? 'text-sm' : 
              size === 'lg' ? 'text-base' : 'text-lg'
            )}>
              {data.initials}
            </span>
          </div>
        )}
      </div>
      
      {showLabel && (
        <div className="mt-2">
          <p className={cn(
            'font-semibold text-gray-900',
            size === 'sm' ? 'text-xs' : 'text-sm'
          )}>
            {data.shortName}
          </p>
          <p className={cn(
            'text-gray-600',
            size === 'sm' ? 'text-xs' : 'text-xs'
          )}>
            {data.fullName}
          </p>
        </div>
      )}
    </div>
  )
}
