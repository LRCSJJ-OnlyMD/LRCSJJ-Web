"use client";

import { trpc } from "@/lib/trpc-client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

  // Google Maps direct link for "Open in Maps" button
  const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}&z=${
    mapConfig.zoom || 15
  }`;

  // Google Maps directions URL
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

  return (
    <Card className={cn("overflow-hidden shadow-lg", className)}>
      <CardContent className="p-0">
        {/* Map Preview */}
        <div className="relative bg-muted/30">
          <div
            className="w-full h-80 bg-muted/50 cursor-pointer hover:opacity-90 transition-opacity duration-300 relative"
            onClick={() => window.open(mapsUrl, "_blank")}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

            {/* Map Icon Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white dark:text-gray-200">
                <div className="w-16 h-16 bg-destructive rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-lg font-semibold mb-2">{locationName}</h4>
                <p className="text-sm opacity-90">
                  Cliquez pour ouvrir Google Maps
                </p>
              </div>
            </div>

            {/* Google Maps Logo */}
            <div className="absolute bottom-4 right-4 bg-card border border-border rounded px-2 py-1 shadow-lg">
              <span className="text-xs font-medium text-foreground">
                Google Maps
              </span>
            </div>
          </div>
        </div>

        {/* Location Info & Actions */}
        <div className="p-4 bg-background border-t">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
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
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={() => window.open(mapsUrl, "_blank")}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Ouvrir dans Maps
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="flex-1 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
                onClick={() => window.open(directionsUrl, "_blank")}
              >
                <Navigation className="h-4 w-4 mr-2" />
                Itinéraire
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
