'use client'

import { useState } from 'react'
import { trpc } from '@/lib/trpc-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import { MapPin, Globe, Settings, Plus, Trash2, CheckCircle, Circle } from 'lucide-react'
import { GoogleMapsEmbed } from '@/components/ui/google-maps'

interface MapConfiguration {
  id: string
  latitude: number
  longitude: number
  locationName: string
  zoom: number
  address?: string | null
  isActive: boolean
  updatedBy?: string | null
  createdAt: Date
  updatedAt: Date
}

export default function MapConfigurationPage() {
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    latitude: 33.5731,
    longitude: -7.5898,
    locationName: '',
    zoom: 12,
    address: '',
    isActive: true,
  })
  const [searchAddress, setSearchAddress] = useState('')

  // Queries
  const { data: configs, refetch: refetchConfigs } = trpc.mapConfig.getAll.useQuery()
  const { data: currentConfig } = trpc.mapConfig.getCurrent.useQuery()

  // Mutations
  const createConfig = trpc.mapConfig.create.useMutation({
    onSuccess: () => {
      toast.success('Map configuration created successfully!')
      setIsCreating(false)
      refetchConfigs()
      resetForm()
    },
    onError: (error) => {
      toast.error(`Failed to create configuration: ${error.message}`)
    },
  })

  const setActiveConfig = trpc.mapConfig.setActive.useMutation({
    onSuccess: () => {
      toast.success('Active configuration updated!')
      refetchConfigs()
    },
    onError: (error) => {
      toast.error(`Failed to set active configuration: ${error.message}`)
    },
  })

  const deleteConfig = trpc.mapConfig.delete.useMutation({
    onSuccess: () => {
      toast.success('Configuration deleted successfully!')
      refetchConfigs()
    },
    onError: (error) => {
      toast.error(`Failed to delete configuration: ${error.message}`)
    },
  })

  const getCoordinatesFromAddress = trpc.mapConfig.getCoordinatesFromAddress.useMutation({
    onSuccess: (data) => {
      if (data.found) {
        setFormData(prev => ({
          ...prev,
          latitude: data.latitude,
          longitude: data.longitude,
          locationName: prev.locationName || data.city || '',
        }))
        toast.success(`Coordinates found for ${data.city}!`)
      } else {
        setFormData(prev => ({
          ...prev,
          latitude: data.latitude,
          longitude: data.longitude,
        }))
        toast.warning(data.message || 'Address not found, using default coordinates')
      }
    },
    onError: (error) => {
      toast.error(`Failed to get coordinates: ${error.message}`)
    },
  })

  const resetForm = () => {
    setFormData({
      latitude: 33.5731,
      longitude: -7.5898,
      locationName: '',
      zoom: 12,
      address: '',
      isActive: true,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.locationName.trim()) {
      toast.error('Please enter a location name')
      return
    }

    createConfig.mutate(formData)
  }

  const handleSearchAddress = () => {
    if (!searchAddress.trim()) {
      toast.error('Please enter an address to search')
      return
    }
    getCoordinatesFromAddress.mutate({ address: searchAddress })
  }

  const handleSetActive = (id: string) => {
    setActiveConfig.mutate({ id })
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this configuration?')) {
      deleteConfig.mutate({ id })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <Globe className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Map Configuration</h1>
      </div>

      {/* Current Map Preview */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <MapPin className="h-5 w-5" />
          <span>Current Map Location</span>
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <GoogleMapsEmbed className="h-80" />
          </div>
          <div className="space-y-4">
            {currentConfig && (
              <div className="space-y-2">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Location Name</Label>
                  <p className="text-lg font-semibold">{currentConfig.locationName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Coordinates</Label>
                  <p className="text-sm text-foreground">
                    Latitude: {currentConfig.latitude.toFixed(6)}<br />
                    Longitude: {currentConfig.longitude.toFixed(6)}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Zoom Level</Label>
                  <p className="text-sm text-foreground">{currentConfig.zoom}</p>
                </div>
                {currentConfig.address && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Address</Label>
                    <p className="text-sm text-foreground">{currentConfig.address}</p>
                  </div>
                )}
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Last Updated</Label>
                  <p className="text-sm text-foreground">
                    {new Date(currentConfig.updatedAt).toLocaleDateString()} by {currentConfig.updatedBy || 'System'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Create New Configuration */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Create New Location</span>
          </h2>
          <Button
            onClick={() => setIsCreating(!isCreating)}
            variant={isCreating ? "outline" : "default"}
          >
            <Plus className="h-4 w-4 mr-2" />
            {isCreating ? 'Cancel' : 'Add Location'}
          </Button>
        </div>

        {isCreating && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Address Search Helper */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <Label className="text-sm font-medium mb-2 block">Quick Address Search</Label>
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter city name (e.g., Casablanca, Rabat, Settat...)"
                  value={searchAddress}
                  onChange={(e) => setSearchAddress(e.target.value)}
                />
                <Button
                  type="button"
                  onClick={handleSearchAddress}
                  disabled={getCoordinatesFromAddress.isPending}
                >
                  {getCoordinatesFromAddress.isPending ? 'Searching...' : 'Search'}
                </Button>
              </div>
              <p className="text-xs text-primary mt-1">
                Search for cities in Morocco to automatically fill coordinates
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="locationName">Location Name *</Label>
                <Input
                  id="locationName"
                  value={formData.locationName}
                  onChange={(e) => setFormData(prev => ({ ...prev, locationName: e.target.value }))}
                  placeholder="e.g., Casablanca Headquarters"
                  required
                />
              </div>
              <div>
                <Label htmlFor="zoom">Zoom Level</Label>
                <Input
                  id="zoom"
                  type="number"
                  min="1"
                  max="21"
                  value={formData.zoom}
                  onChange={(e) => setFormData(prev => ({ ...prev, zoom: parseInt(e.target.value) }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="latitude">Latitude *</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => setFormData(prev => ({ ...prev, latitude: parseFloat(e.target.value) }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="longitude">Longitude *</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => setFormData(prev => ({ ...prev, longitude: parseFloat(e.target.value) }))}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Full Address (Optional)</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="e.g., 123 Rue Mohamed V, Casablanca, Morocco"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                className="h-4 w-4"
                title="Set as active location"
              />
              <Label htmlFor="isActive">Set as active location immediately</Label>
            </div>

            <div className="flex space-x-2">
              <Button type="submit" disabled={createConfig.isPending}>
                {createConfig.isPending ? 'Creating...' : 'Create Configuration'}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                Reset Form
              </Button>
            </div>
          </form>
        )}
      </Card>

      {/* Existing Configurations */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Saved Locations</h2>
        <div className="space-y-3">
          {configs?.map((config: MapConfiguration) => (
            <div
              key={config.id}
              className={`p-4 rounded-lg border ${
                config.isActive ? 'border-green-200 bg-green-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    {config.isActive ? (
                      <CheckCircle className="h-5 w-5 text-accent" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                    <h3 className="font-semibold text-foreground">{config.locationName}</h3>
                    {config.isActive && (
                      <span className="bg-accent/10 text-accent-foreground text-xs px-2 py-1 rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    <p>Coordinates: {config.latitude.toFixed(4)}, {config.longitude.toFixed(4)}</p>
                    {config.address && <p>Address: {config.address}</p>}
                    <p>Updated: {new Date(config.updatedAt).toLocaleDateString()} by {config.updatedBy || 'System'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {!config.isActive && (
                    <Button
                      size="sm"
                      onClick={() => handleSetActive(config.id)}
                      disabled={setActiveConfig.isPending}
                    >
                      Set Active
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(config.id)}
                    disabled={deleteConfig.isPending || config.isActive}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {(!configs || configs.length === 0) && (
            <p className="text-muted-foreground text-center py-8">
              No saved locations yet. Create your first location configuration above.
            </p>
          )}
        </div>
      </Card>

      {/* Instructions */}
      <Card className="p-6 bg-blue-50">
        <h3 className="font-semibold mb-2">How to get coordinates:</h3>
        <ul className="text-sm space-y-1 text-foreground">
          <li>1. Use the address search above for common Moroccan cities</li>
          <li>2. Go to Google Maps, right-click on your desired location</li>
          <li>3. Click on the coordinates that appear to copy them</li>
          <li>4. Paste the latitude and longitude in the form above</li>
          <li>5. Use zoom levels: 1 (world) to 21 (building level), 12-15 recommended for cities</li>
        </ul>
      </Card>
    </div>
  )
}
