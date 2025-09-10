'use client'

import { cn } from '@/lib/utils'
import { Shield, Lock } from 'lucide-react'

interface LoginLogoProps {
  size?: 'md' | 'lg' | 'xl'
  className?: string
  variant?: 'shield' | 'lock' | 'badge'
}

const sizeClasses = {
  md: 'w-12 h-12', // 48px
  lg: 'w-16 h-16', // 64px
  xl: 'w-20 h-20', // 80px
}

const iconSizeClasses = {
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-10 h-10',
}

export function LoginLogo({ size = 'lg', className, variant = 'shield' }: LoginLogoProps) {
  const IconComponent = variant === 'lock' ? Lock : Shield
  
  return (
    <div className={cn('flex flex-col items-center', className)}>
      {/* Admin logo with security theme */}
      <div className={cn(
        'bg-gradient-to-r from-[#d62027] to-[#017444] rounded-full flex items-center justify-center shadow-lg',
        sizeClasses[size]
      )}>
        {variant === 'badge' ? (
          // Badge-style logo placeholder - replace with actual admin badge
          <div className={cn(
            'bg-white/20 rounded-full flex items-center justify-center',
            iconSizeClasses[size]
          )}>
            <span className={cn(
              'text-white font-bold',
              size === 'md' ? 'text-xs' : 
              size === 'lg' ? 'text-sm' : 'text-base'
            )}>
              ADMIN
            </span>
          </div>
        ) : (
          <IconComponent className={cn('text-white', iconSizeClasses[size])} />
        )}
      </div>
      
      <div className="mt-2 text-center">
        <p className={cn(
          'font-semibold text-gray-900',
          size === 'md' ? 'text-sm' : 'text-base'
        )}>
          Admin Access
        </p>
        <p className={cn(
          'text-gray-600',
          size === 'md' ? 'text-xs' : 'text-sm'
        )}>
          Secure Portal
        </p>
      </div>
    </div>
  )
}
