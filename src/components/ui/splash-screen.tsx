'use client'

import { useState, useEffect } from 'react'
import { LeagueLogo } from '@/components/logos/LeagueLogo'

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true)
  const [isAnimating, setIsAnimating] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Hide splash screen after animations complete
    const timer = setTimeout(() => {
      setIsAnimating(false)
      setTimeout(() => setIsVisible(false), 800)
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  if (!mounted || !isVisible) return null

  return (
    <div className={`splash-screen ${!isAnimating ? 'splash-fade-out' : ''}`}>
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-red-500/20 to-green-500/20 rounded-full blur-3xl silicon-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-green-500/20 to-red-500/20 rounded-full blur-3xl silicon-float delay-2"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-red-500/10 to-green-500/10 rounded-full blur-3xl silicon-pulse"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center">
        <div className="splash-logo mb-8">
          <LeagueLogo size="xl" />
        </div>
        
        <div className="silicon-bounce delay-3">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            LRCSJJ
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground silicon-enter delay-4">
            Ligue Régionale Casablanca-Settat
          </p>
        </div>

        {/* Loading Animation */}
        <div className="mt-12 silicon-enter delay-5">
          <div className="loading-dots">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-20 w-4 h-4 bg-red-500 rounded-full silicon-float delay-1"></div>
      <div className="absolute top-40 right-32 w-3 h-3 bg-green-500 rounded-full silicon-float delay-3"></div>
      <div className="absolute bottom-32 left-40 w-5 h-5 bg-red-500 rounded-full silicon-float delay-2"></div>
      <div className="absolute bottom-20 right-20 w-3 h-3 bg-green-500 rounded-full silicon-float delay-4"></div>
    </div>
  )
}
