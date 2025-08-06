'use client'

import { useState, useEffect, useRef } from 'react'
import { trpc } from '@/lib/trpc-client'
import type { Map as LeafletMap } from 'leaflet'

interface OpenStreetMapProps {
  className?: string
  height?: string
}

export function GoogleMap({ className = '', height = '300px' }: OpenStreetMapProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [mapInitialized, setMapInitialized] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mapConfig, setMapConfig] = useState({
    latitude: 33.5731,
    longitude: -7.5898,
    locationName: 'Casablanca-Settat Ju-Jitsu League',
    zoom: 12
  })
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMapRef = useRef<LeafletMap | null>(null)

  // Fetch current map configuration from database
  const { data: config, isLoading: configLoading, error: configError } = trpc.mapConfig.getCurrent.useQuery(
    undefined,
    {
      retry: 3,
      retryDelay: 1000,
    }
  )

  useEffect(() => {
    if (config && !configLoading) {
      setMapConfig({
        latitude: config.latitude,
        longitude: config.longitude,
        locationName: config.locationName,
        zoom: config.zoom
      })
    } else if (configError) {
      console.warn('Failed to load map config, using defaults:', configError)
      setError('Using default location')
    }
  }, [config, configLoading, configError])

  useEffect(() => {
    let mounted = true
    
    const loadLeaflet = async () => {
      if (typeof window !== 'undefined' && mapRef.current && !mapInitialized) {
        try {
          setIsLoading(true)
          
          // Import Leaflet CSS
          if (!document.querySelector('link[href*="leaflet"]')) {
            const link = document.createElement('link')
            link.rel = 'stylesheet'
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
            link.onload = () => console.log('Leaflet CSS loaded')
            document.head.appendChild(link)
            
            // Wait for CSS to load
            await new Promise(resolve => setTimeout(resolve, 500))
          }

          // Import Leaflet JS
          const L = await import('leaflet')

          if (!mounted) return

          // Fix default icon paths
          delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl
          L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
          })

          // Clear existing map
          if (leafletMapRef.current) {
            leafletMapRef.current.remove()
            leafletMapRef.current = null
          }

          // Create new map
          const map = L.map(mapRef.current, {
            zoomControl: true,
            scrollWheelZoom: true,
            doubleClickZoom: true,
            touchZoom: true,
          }).setView([mapConfig.latitude, mapConfig.longitude], mapConfig.zoom)

          // Add OpenStreetMap tiles (free)
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
            subdomains: ['a', 'b', 'c'],
          }).addTo(map)

          // Add marker with custom popup
          const marker = L.marker([mapConfig.latitude, mapConfig.longitude]).addTo(map)
          
          const popupContent = `
            <div style="font-family: Arial, sans-serif;">
              <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 16px;">${mapConfig.locationName}</h3>
              <p style="margin: 0; color: #6b7280; font-size: 12px;">
                📍 ${mapConfig.latitude.toFixed(4)}, ${mapConfig.longitude.toFixed(4)}
              </p>
            </div>
          `
          
          marker.bindPopup(popupContent)

          // Store map reference
          leafletMapRef.current = map
          setMapInitialized(true)
          setIsLoading(false)
          setError(null)

          console.log('Map loaded successfully:', mapConfig.locationName)

        } catch (error) {
          console.error('Error loading map:', error)
          if (mounted) {
            setError('Failed to load map')
            setIsLoading(false)
          }
        }
      }
    }

    // Only load map after config is ready or after timeout
    if (!configLoading) {
      loadLeaflet()
    }

    return () => {
      mounted = false
      if (leafletMapRef.current) {
        leafletMapRef.current.remove()
        leafletMapRef.current = null
      }
    }
  }, [mapConfig, configLoading, mapInitialized])

  // Create inline style for height
  const mapStyle = { height, minHeight: height }
  const loadingStyle = { height, minHeight: height }

  if (isLoading || configLoading) {
    return (
      <div 
        className={`bg-muted rounded-lg flex items-center justify-center ${className} transition-all duration-300`}
        style={loadingStyle}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground text-sm">
            {configLoading ? 'Loading location...' : 'Loading map...'}
          </p>
          {error && (
            <p className="text-yellow-600 dark:text-yellow-400 text-xs mt-1">{error}</p>
          )}
        </div>
      </div>
    )
  }

  if (error && !mapInitialized) {
    return (
      <div 
        className={`bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center justify-center ${className}`}
        style={loadingStyle}
      >
        <div className="text-center p-4">
          <p className="text-red-600 dark:text-red-400 text-sm font-medium">Map Failed to Load</p>
          <p className="text-red-500 dark:text-red-500 text-xs mt-1">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`rounded-lg overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 ${className} transition-all duration-300`}>
      <div
        ref={mapRef}
        className="w-full transition-opacity duration-300"
        style={mapStyle}
      />
      <div className="bg-card p-3 border-t">
        <h3 className="font-semibold text-foreground">{mapConfig.locationName}</h3>
        <p className="text-sm text-muted-foreground">
          📍 Coordinates: {mapConfig.latitude.toFixed(4)}, {mapConfig.longitude.toFixed(4)}
        </p>
        <p className="text-xs text-muted-foreground mt-1 flex items-center">
          <span className="mr-1">🗺️</span>
          Powered by OpenStreetMap - Free & Open Source
        </p>
      </div>
    </div>
  )
}
