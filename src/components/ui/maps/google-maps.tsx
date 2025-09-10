"use client";

import { trpc } from "@/lib/trpc-client";
import { Card, CardContent } from "@/components/ui/primitives/card";
import { Button } from "@/components/ui/primitives/button";
import { MapPin, ExternalLink, Navigation, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface GoogleMapsEmbedProps {
  className?: string;
  showActions?: boolean;
}

export function GoogleMapsEmbed({
  className,
  showActions = true,
}: GoogleMapsEmbedProps) {
  const { data: mapConfig, isLoading: isConfigLoading } =
    trpc.mapConfig.getCurrent.useQuery();

  if (isConfigLoading) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <CardContent className="p-0">
          <div className="flex items-center justify-center h-80 bg-muted/30">
            <div className="flex flex-col items-center space-y-2">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Chargement de la carte...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!mapConfig) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <CardContent className="p-0">
          <div className="flex items-center justify-center h-80 bg-muted/30">
            <div className="flex flex-col items-center space-y-2">
              <MapPin className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Aucune configuration de carte trouvée
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { latitude, longitude, locationName, address } = mapConfig;

  // Google Maps URL for embedding (using search format which works without API key)
  const embedUrl = `https://www.google.com/maps?q=${latitude},${longitude}&hl=fr&z=${
    mapConfig.zoom || 15
  }&output=embed`;

  // Google Maps direct link for "Open in Maps" button
  const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}&z=${
    mapConfig.zoom || 15
  }`;

  // Google Maps directions URL
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

  return (
    <Card className={cn("overflow-hidden shadow-lg", className)}>
      <CardContent className="p-0">
        {/* Google Maps Iframe */}
        <div className="relative">
          <iframe
            width="100%"
            height="320"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={embedUrl}
            className="w-full h-80 border-0"
            title={`Carte Google Maps - ${locationName}`}
            allow="geolocation"
          />

          {/* Overlay for better interaction */}
          <div className="absolute top-2 right-2 bg-card/90 backdrop-blur-sm rounded-lg px-3 py-1 shadow-md border border-border">
            <span className="text-xs font-medium text-foreground">
              Google Maps
            </span>
          </div>
        </div>

        {/* Location Info & Actions */}
        <div className="p-4 bg-background border-t">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="h-5 w-5 text-[#017444] flex-shrink-0" />
                <h3 className="font-semibold text-foreground">
                  {locationName}
                </h3>
              </div>

              {address && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {address}
                </p>
              )}

              <div className="mt-2 text-xs text-muted-foreground">
                <span className="font-mono">
                  {latitude.toFixed(6)}, {longitude.toFixed(6)}
                </span>
              </div>
            </div>
          </div>

          {showActions && (
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <Button
                variant="default"
                size="sm"
                className="flex-1 bg-[#017444] hover:bg-emerald-700 text-white"
                onClick={() => window.open(mapsUrl, "_blank")}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Ouvrir dans Google Maps
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="flex-1 hover:bg-[#d62027] hover:text-white hover:border-[#d62027]"
                onClick={() => window.open(directionsUrl, "_blank")}
              >
                <Navigation className="h-4 w-4 mr-2" />
                Obtenir l&apos;itinéraire
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
