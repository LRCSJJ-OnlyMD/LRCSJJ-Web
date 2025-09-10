# LRCSJJ Project Structure Reorganization Plan

## Current Issues
1. Mixed UI components (shared vs specific)
2. No clear separation between public, admin, and club-manager features
3. Logos and assets not properly organized
4. Business logic mixed with UI components

## New Proposed Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Public routes group
│   │   ├── page.tsx              # Landing page
│   │   ├── about/
│   │   ├── posts/
│   │   ├── contact/
│   │   └── layout.tsx            # Public layout
│   ├── (auth)/                   # Authentication routes
│   │   ├── login/
│   │   └── layout.tsx            # Auth layout
│   ├── admin/                    # Admin routes (protected)
│   │   ├── layout.tsx            # Admin layout
│   │   ├── page.tsx              # Admin dashboard
│   │   ├── athletes/
│   │   ├── clubs/
│   │   ├── championships/
│   │   ├── insurance/
│   │   ├── seasons/
│   │   ├── teams/
│   │   ├── posts/
│   │   ├── map-config/
│   │   └── club-managers/
│   ├── club-manager/             # Club manager routes (protected)
│   │   ├── layout.tsx            # Club manager layout
│   │   ├── dashboard/
│   │   ├── athletes/
│   │   ├── payments/
│   │   └── login/
│   ├── payment/                  # Payment routes
│   │   ├── success/
│   │   └── cancel/
│   └── api/                      # API routes
│       ├── auth/
│       ├── admin/
│       ├── club-manager/
│       ├── payments/
│       ├── contact/
│       ├── map-config/
│       ├── test-email/
│       └── trpc/
├── components/                   # React Components
│   ├── ui/                       # Base UI components (shadcn/ui)
│   │   ├── primitives/           # Core primitives
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── form.tsx
│   │   │   ├── table.tsx
│   │   │   ├── select.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── label.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── scroll-area.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   └── sonner.tsx
│   │   ├── layout/               # Layout components
│   │   │   ├── navbar.tsx
│   │   │   ├── footer.tsx
│   │   │   ├── sidebar.tsx
│   │   │   └── splash-screen.tsx
│   │   ├── forms/                # Form components
│   │   │   ├── contact-form.tsx
│   │   │   ├── athlete-form-dialog.tsx
│   │   │   └── image-upload.tsx
│   │   ├── maps/                 # Map components
│   │   │   ├── google-map.tsx
│   │   │   ├── google-maps.tsx
│   │   │   └── google-maps-embed.tsx
│   │   └── theme/                # Theme components
│   │       ├── theme-provider.tsx
│   │       ├── theme-toggle.tsx
│   │       └── language-switcher.tsx
│   ├── shared/                   # Shared business components
│   │   ├── auth/                 # Authentication components
│   │   │   ├── SessionValidation.tsx
│   │   │   ├── AdminAccess.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── logos/                # Logo components
│   │   │   ├── FederationLogo.tsx
│   │   │   ├── LeagueLogo.tsx
│   │   │   ├── LoginLogo.tsx
│   │   │   ├── PersonAvatar.tsx
│   │   │   └── index.ts
│   │   ├── payments/             # Payment components
│   │   │   ├── PaymentProcessing.tsx
│   │   │   ├── StripePaymentProcessing.tsx
│   │   │   ├── PaymentDetailsDialog.tsx
│   │   │   └── AthletePaymentManager.tsx
│   │   └── notifications/        # Notification components
│   │       ├── NotificationBell.tsx
│   │       └── NotificationCenter.tsx
│   ├── features/                 # Feature-specific components
│   │   ├── public/               # Public site features
│   │   │   ├── landing/
│   │   │   ├── about/
│   │   │   ├── posts/
│   │   │   └── contact/
│   │   ├── admin/                # Admin features
│   │   │   ├── dashboard/
│   │   │   ├── athletes/
│   │   │   ├── clubs/
│   │   │   ├── championships/
│   │   │   ├── insurance/
│   │   │   ├── seasons/
│   │   │   ├── teams/
│   │   │   ├── posts/
│   │   │   ├── map-config/
│   │   │   └── club-managers/
│   │   └── club-manager/         # Club manager features
│   │       ├── dashboard/
│   │       ├── athletes/
│   │       └── payments/
│   └── layouts/                  # Layout components
│       ├── PublicLayout.tsx
│       ├── AdminLayout.tsx
│       ├── ClubManagerLayout.tsx
│       └── AuthLayout.tsx
├── lib/                          # Utilities and configurations
│   ├── utils.ts                  # General utilities
│   ├── auth.ts                   # Authentication utilities
│   ├── logger.ts                 # Logging utility
│   ├── prisma.ts                 # Database client
│   ├── api/                      # API utilities
│   │   ├── trpc.ts
│   │   ├── trpc-client.ts
│   │   ├── trpc-provider.tsx
│   │   └── routers/              # tRPC routers
│   ├── services/                 # Business logic services
│   │   ├── auth/
│   │   ├── payments/
│   │   ├── email/
│   │   ├── sms/
│   │   ├── cloudinary/
│   │   └── notifications/
│   ├── hooks/                    # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useLocalStorage.ts
│   │   └── usePayments.ts
│   └── types/                    # TypeScript type definitions
│       ├── auth.ts
│       ├── payment.ts
│       ├── database.ts
│       └── api.ts
├── config/                       # Configuration files
│   ├── logos.ts
│   ├── database.ts
│   ├── payments.ts
│   └── constants.ts
└── middleware.ts                 # Next.js middleware
```

## Benefits of New Structure

1. **Clear Separation of Concerns**: Public, Admin, Club Manager features are clearly separated
2. **Reusable Components**: Shared components in dedicated folders
3. **Feature-Based Organization**: Related components grouped together
4. **Scalable Architecture**: Easy to add new features and maintain
5. **Type Safety**: Dedicated types folder for better TypeScript support
6. **Business Logic Separation**: Services folder for business logic
7. **Better Imports**: Clear import paths for different types of components

## Migration Steps

1. Create new folder structure
2. Move UI primitives to ui/primitives/
3. Move business components to shared/
4. Create feature-specific components
5. Update all imports throughout the application
6. Test all functionality
7. Update documentation

## Import Examples

```typescript
// UI Primitives
import { Button } from '@/components/ui/primitives/button'
import { Card } from '@/components/ui/primitives/card'

// Shared Business Components
import { AdminAccess } from '@/components/shared/auth/AdminAccess'
import { LeagueLogo } from '@/components/shared/logos/LeagueLogo'

// Feature Components
import { DashboardStats } from '@/components/features/admin/dashboard/DashboardStats'
import { AthleteList } from '@/components/features/club-manager/athletes/AthleteList'

// Services
import { authService } from '@/lib/services/auth/authService'
import { paymentService } from '@/lib/services/payments/paymentService'

// Types
import type { User, AdminUser } from '@/lib/types/auth'
import type { PaymentSession } from '@/lib/types/payment'
```
