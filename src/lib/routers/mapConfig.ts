import { z } from 'zod';
import { router, publicProcedure, adminProcedure } from '../trpc';

export const mapConfigRouter = router({
  // Get current active map configuration (public - for displaying the map)
  getCurrent: publicProcedure.query(async ({ ctx }) => {
    const config = await ctx.prisma.mapConfiguration.findFirst({
      where: { isActive: true },
      orderBy: { updatedAt: 'desc' },
    });

    // Return default config if none exists
    if (!config) {
      return {
        id: 'default',
        latitude: 33.5731,
        longitude: -7.5898,
        locationName: 'Casablanca-Settat Ju-Jitsu League',
        zoom: 12,
        address: 'Casablanca, Morocco',
        isActive: true,
        updatedBy: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    return config;
  }),

  // Get all map configurations (admin only)
  getAll: adminProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.mapConfiguration.findMany({
      orderBy: { updatedAt: 'desc' },
    });
  }),

  // Create new map configuration (admin only)
  create: adminProcedure
    .input(
      z.object({
        latitude: z.number().min(-90).max(90),
        longitude: z.number().min(-180).max(180),
        locationName: z.string().min(1).max(255),
        zoom: z.number().min(1).max(21).default(12),
        address: z.string().optional(),
        isActive: z.boolean().default(true),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // If setting as active, deactivate others
      if (input.isActive) {
        await ctx.prisma.mapConfiguration.updateMany({
          where: { isActive: true },
          data: { isActive: false },
        });
      }

      return await ctx.prisma.mapConfiguration.create({
        data: {
          ...input,
          updatedBy: ctx.admin.email,
        },
      });
    }),

  // Update map configuration (admin only)
  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        latitude: z.number().min(-90).max(90),
        longitude: z.number().min(-180).max(180),
        locationName: z.string().min(1).max(255),
        zoom: z.number().min(1).max(21),
        address: z.string().optional(),
        isActive: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // If setting as active, deactivate others
      if (input.isActive) {
        await ctx.prisma.mapConfiguration.updateMany({
          where: { 
            isActive: true,
            id: { not: input.id }
          },
          data: { isActive: false },
        });
      }

      return await ctx.prisma.mapConfiguration.update({
        where: { id: input.id },
        data: {
          latitude: input.latitude,
          longitude: input.longitude,
          locationName: input.locationName,
          zoom: input.zoom,
          address: input.address,
          isActive: input.isActive,
          updatedBy: ctx.admin.email,
        },
      });
    }),

  // Set active configuration (admin only)
  setActive: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Deactivate all others
      await ctx.prisma.mapConfiguration.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      });

      // Activate the selected one
      return await ctx.prisma.mapConfiguration.update({
        where: { id: input.id },
        data: { 
          isActive: true,
          updatedBy: ctx.admin.email,
        },
      });
    }),

  // Delete map configuration (admin only)
  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.mapConfiguration.delete({
        where: { id: input.id },
      });
    }),

  // Helper to get coordinates from an address (using geocoding)
  getCoordinatesFromAddress: adminProcedure
    .input(z.object({ address: z.string() }))
    .mutation(async ({ input }) => {
      try {
        // Morocco cities with accurate coordinates
        const addressLower = input.address.toLowerCase();
        
        const coordinates: Record<string, { lat: number; lng: number; zoom?: number }> = {
          'casablanca': { lat: 33.5731, lng: -7.5898, zoom: 12 },
          'casa': { lat: 33.5731, lng: -7.5898, zoom: 12 },
          'rabat': { lat: 34.0209, lng: -6.8416, zoom: 12 },
          'sale': { lat: 34.0531, lng: -6.7985, zoom: 13 },
          'salé': { lat: 34.0531, lng: -6.7985, zoom: 13 },
          'settat': { lat: 33.0013, lng: -7.6217, zoom: 13 },
          'berrechid': { lat: 33.2651, lng: -7.5862, zoom: 14 },
          'mohammedia': { lat: 33.6866, lng: -7.3830, zoom: 13 },
          'benslimane': { lat: 33.6142, lng: -7.1208, zoom: 14 },
          'ben slimane': { lat: 33.6142, lng: -7.1208, zoom: 14 },
          'temara': { lat: 33.9289, lng: -6.9067, zoom: 14 },
          'témara': { lat: 33.9289, lng: -6.9067, zoom: 14 },
          'skhirate': { lat: 33.8559, lng: -7.0341, zoom: 15 },
          'nouaceur': { lat: 33.3661, lng: -7.5797, zoom: 14 },
          'mediouna': { lat: 33.4536, lng: -7.4167, zoom: 14 },
          'bouskoura': { lat: 33.4667, lng: -7.6167, zoom: 15 },
          // Major training centers and sports facilities
          'complexe mohammed v': { lat: 33.5923, lng: -7.6198, zoom: 16 },
          'complexe sportif mohammed v': { lat: 33.5923, lng: -7.6198, zoom: 16 },
          'stade mohammed v': { lat: 33.5923, lng: -7.6198, zoom: 16 },
          'complexe prince moulay abdellah': { lat: 34.0142, lng: -6.8292, zoom: 16 },
          'academie mohammed vi': { lat: 33.5847, lng: -7.6094, zoom: 16 },
        };

        for (const [city, coords] of Object.entries(coordinates)) {
          if (addressLower.includes(city)) {
            return {
              latitude: coords.lat,
              longitude: coords.lng,
              zoom: coords.zoom || 12,
              found: true,
              city: city.charAt(0).toUpperCase() + city.slice(1),
              suggestion: `Found coordinates for ${city.charAt(0).toUpperCase() + city.slice(1)}`,
            };
          }
        }

        // If no exact match, try partial matches
        const partialMatches = Object.entries(coordinates).filter(([city]) => 
          city.toLowerCase().includes(addressLower) || addressLower.includes(city.toLowerCase())
        );

        if (partialMatches.length > 0) {
          const [city, coords] = partialMatches[0];
          return {
            latitude: coords.lat,
            longitude: coords.lng,
            zoom: coords.zoom || 12,
            found: true,
            city: city.charAt(0).toUpperCase() + city.slice(1),
            suggestion: `Partial match found for ${city.charAt(0).toUpperCase() + city.slice(1)}`,
          };
        }

        return {
          latitude: 33.5731,
          longitude: -7.5898,
          zoom: 12,
          found: false,
          message: 'Address not found in our Morocco database. Using default coordinates for Casablanca.',
          suggestion: 'Try searching for: Casablanca, Rabat, Settat, Berrechid, Mohammedia, Benslimane, Temara, Sale',
        };
      } catch {
        throw new Error('Failed to get coordinates from address');
      }
    }),
});
