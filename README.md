# Casablanca-Settat Ju-Jitsu League Platform

A modern, secure, and multilingual full-stack web application for the regional Ju-Jitsu League of Casablanca-Settat under the Moroccan Federation. Features enterprise-grade authentication with Email 2FA verification.

## 🏆 Features

### Public Website
- **Landing Page** - Introduction to the league with achievements and statistics
- **About Page** - League history, mission, key people, and timeline
- **Contact Page** - Contact form with email notifications and Google Maps integration
- **Multilingual Support** - Arabic (🇲🇦), French (🇫🇷), and English (🇬🇧)
- **Responsive Design** - Mobile-first, fully responsive across all devices
- **Modern UI** - 2025 futuristic design with league colors
- **Dark/Light Theme** - Automatic theme switching with semantic OKLCH colors

### Admin Dashboard (`/admin`)
- **Enhanced Authentication** - JWT-based login with Email 2FA verification
- **Password Security** - Visibility toggle and secure input handling
- **Dashboard KPIs** - Real-time statistics and comprehensive overview
- **Club Management** - CRUD operations for affiliated clubs with Google Maps integration
- **Athlete Management** - Complete athlete profiles with search and filtering
- **Insurance Tracking** - Season-based insurance management
- **Championship Management** - Event creation and club registration tracking
- **League Teams** - 1st and 2nd division team management
- **Season Management** - Competition season administration
- **Map Configuration** - Google Maps settings and location management

## 🛠 Tech Stack

- **Frontend**: Next.js 15.4.5 (App Router), TypeScript, TailwindCSS v4
- **UI Components**: shadcn/ui, Radix UI primitives
- **Backend**: tRPC for type-safe APIs
- **Database**: PostgreSQL with Prisma ORM (hosted)
- **Authentication**: Enhanced JWT with Email 2FA verification
- **Email Services**: Nodemailer with SMTP for secure email delivery
- **Maps**: Google Maps URL-based embedding (no API key required)
- **Styling**: TailwindCSS with semantic OKLCH color system
- **Icons**: Lucide React
- **Notifications**: Sonner (toast notifications)
- **File Upload**: Cloudinary integration

## 🔐 Authentication & Security

### Enhanced Security Features
- **Email 2FA** - Two-factor authentication using email verification codes
- **Password Visibility Toggle** - Enhanced login UX
- **JWT Token Security** - Secure token-based authentication
- **Email Code Validation** - Time-limited verification codes with attempt limits
- **Route Protection** - Server-side authentication checks
- **Admin-Only Access** - Two-admin system stored in database
- **Secure Route Naming** - Admin routes (`/admin`)

### Email Verification Flow
```typescript
// Automatic email verification with time-limited codes
Step 1: Credentials → Step 2: Email 2FA → Step 3: Dashboard Access
6-digit codes → 10-minute expiry → 3 attempts maximum
```

## 🎨 Design System

### Colors (Semantic OKLCH)
- **Primary Red**: `oklch(55% 0.18 23)` - League primary color
- **Primary Green**: `oklch(45% 0.15 155)` - League secondary color  
- **Neutral Whites**: `oklch(98% 0 0)` - Clean backgrounds
- **Dark Mode**: Automatic adaptation with semantic color tokens

### Typography
- **Font**: Inter (clean, modern sans-serif)
- **Weights**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (hosted)
- SMTP email service (Gmail, Outlook, etc.)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lrcsjj-webapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   # Database (Hosted PostgreSQL)
   DATABASE_URL="postgresql://username:password@host:5432/database"
   
   # Authentication
   JWT_SECRET="your-super-secret-jwt-key-minimum-64-characters"
   
   # Email Configuration (Required for 2FA)
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT="587"
   SMTP_USER="your-email@gmail.com"
   SMTP_PASS="your-app-password"
   SMTP_FROM="your-email@gmail.com"
   ADMIN_EMAIL="admin@lrcsjj.ma"
   
   # Optional: Cloudinary for file uploads
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
   CLOUDINARY_API_KEY="your-api-key"
   CLOUDINARY_API_SECRET="your-api-secret"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push database schema to hosted PostgreSQL
   npm run db:push
   
   # Seed the database with initial data
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

Visit `http://localhost:3000` to see the application.

### Default Admin Credentials
- **Email**: `admin@lrcsjj.ma`  
- **Password**: `AdminPass2025!`

Access the admin dashboard at: `http://localhost:3000/admin`

## 📁 Project Structure

```
src/
├── app/                              # Next.js App Router pages
│   ├── page.tsx                     # Landing page
│   ├── about/page.tsx               # About page
│   ├── contact/page.tsx             # Contact page with maps
│   ├── login/page.tsx               # Enhanced admin login with Email 2FA
│   ├── admin/                       # Admin dashboard
│   │   ├── athletes/               # Athlete management
│   │   ├── clubs/                  # Club management with maps
│   │   ├── championships/          # Championship management
│   │   ├── insurance/              # Insurance tracking
│   │   ├── seasons/                # Season management
│   │   ├── teams/                  # League team management
│   │   └── map-config/             # Google Maps configuration
│   └── api/
│       ├── contact/route.ts        # Contact form API
│       ├── test-email/route.ts     # Email testing
│       └── trpc/route.ts           # tRPC API routes
├── components/
│   ├── ui/                         # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── contact-form.tsx        # Contact form component
│   │   ├── google-maps.tsx         # Maps integration
│   │   ├── language-switcher.tsx   # Language selector
│   │   ├── image-upload.tsx        # Cloudinary uploader
│   │   └── ...
│   ├── admin/                      # Admin-specific components
│   ├── public/                     # Public site components
│   └── logos/                      # Logo components
│       ├── FederationLogo.tsx
│       ├── LeagueLogo.tsx
│       └── LoginLogo.tsx
├── lib/
│   ├── auth.ts                     # Enhanced JWT authentication
│   ├── email-verification.ts      # Email 2FA service
│   ├── email.ts                    # Email service with Nodemailer
│   ├── prisma.ts                   # Database client
│   ├── trpc.ts                     # tRPC server config
│   ├── trpc-client.ts              # tRPC client config
│   ├── trpc-provider.tsx           # tRPC React provider
│   ├── language-context.tsx        # Internationalization
│   ├── theme-provider.tsx          # Dark/Light theme
│   └── routers/                    # tRPC route handlers
│       ├── auth.ts                 # Enhanced auth with Email 2FA
│       ├── clubs.ts                # Club management
│       ├── athletes.ts             # Athlete management
│       ├── map-config.ts           # Maps configuration
│       └── index.ts
prisma/
├── schema.prisma                   # Enhanced database schema
└── seed.ts                         # Database seeding script
```

## 🗄 Database Schema

### Core Models
- **Admin** - System administrators with email verification
- **Club** - Affiliated Ju-Jitsu clubs with Google Maps coordinates
- **Athlete** - Individual athletes with comprehensive profiles
- **Season** - Competition seasons (e.g., 2024-2025)
- **Insurance** - Athlete insurance payments per season
- **Championship** - Competition events with club registrations
- **LeagueTeam** - 1st and 2nd division teams
- **LeagueTeamMember** - Team assignments
- **MapConfig** - Google Maps settings and configuration

### Enhanced Features
- **Email verification fields** for 2FA authentication
- **Google Maps coordinates** for club locations
- **Season-based relationships** for insurance and teams
- **Comprehensive audit trails** for data changes

## 📋 Available Scripts

```bash
# Development
npm run dev                    # Start development server with hot reload
npm run build                  # Build for production
npm run start                  # Start production server
npm run lint                   # Run ESLint with TypeScript rules

# Database
npm run db:generate           # Generate Prisma client
npm run db:push              # Push schema to hosted PostgreSQL
npm run db:migrate           # Run database migrations
npm run db:seed              # Seed database with sample data
npm run db:studio            # Open Prisma Studio
npm run db:reset             # Reset and reseed database
```

## 🌐 Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
2. **Set environment variables** in Vercel dashboard:
   ```bash
   # Essential Variables
   DATABASE_URL=postgresql://...
   JWT_SECRET=your-64-character-secret
   
   # Email Configuration (Required for 2FA)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   SMTP_FROM=your-email@gmail.com
   ADMIN_EMAIL=admin@lrcsjj.ma
   
   # Optional: Cloudinary
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

3. **Deploy** - Vercel will automatically build and deploy
4. **Test Email 2FA** - Verify email verification works in production

### Build Process
- **Prisma Client Generation** - Automatic via `npm run build`
- **TypeScript Compilation** - Strict mode enabled
- **TailwindCSS Processing** - Optimized for production
- **Bundle Optimization** - Next.js optimization with code splitting

## 🌍 Internationalization

The application supports three languages with complete translations:
- **Arabic (AR)** 🇲🇦 - Right-to-left support
- **French (FR)** 🇫🇷 - Official language
- **English (EN)** 🇬🇧 - International support

### Translation Files
```
public/locales/
├── ar/common.json     # Arabic translations
├── fr/common.json     # French translations  
└── en/common.json     # English translations
```

Language switching is available in the navigation header with automatic persistence.

## 🗺️ Google Maps Integration

### URL-Based Implementation (No API Key Required)
- **Club Locations** - Embedded maps for each club
- **Contact Page** - League headquarters location
- **Map Configuration** - Admin-configurable map settings
- **Responsive Maps** - Mobile-optimized map viewing

### Map Features
- **Automatic Embedding** - URL-based Google Maps integration
- **Location Management** - Admin interface for coordinate management
- **Dark Mode Support** - Maps adapt to theme automatically
- **Mobile Optimization** - Touch-friendly map interactions

## 🏅 Federation Compliance

The platform displays official logos and links for:
- **Casablanca-Settat Regional League** - Primary organization
- **Royal Moroccan Ju-Jitsu Federation** - National federation
- **North African Union of Ju-Jitsu** - Regional body
- **African Union of Ju-Jitsu** - Continental organization
- **JJIF (International Ju-Jitsu Federation)** - World governing body

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   ```bash
   # Verify hosted PostgreSQL connection
   npm run db:generate
   # Check DATABASE_URL format: postgresql://user:pass@host:port/db
   ```

2. **Email 2FA Not Working**
   ```bash
   # Check all SMTP_* variables are set correctly
   # Verify email credentials and app passwords
   # Test with npm run test:email (if available)
   ```

3. **Authentication Issues**
   ```bash
   # Verify JWT_SECRET is set (minimum 64 characters)
   # Check admin user exists: npm run db:studio
   # Clear browser localStorage and cookies
   ```

4. **Build Errors**
   ```bash
   # Generate Prisma client after schema changes
   npm run db:generate
   # Clear build cache
   rm -rf .next && npm run build
   ```

### Email Configuration
- **Gmail**: Use App Passwords, not regular passwords
- **Outlook**: Enable SMTP access in account settings
- **Custom SMTP**: Verify TLS/SSL settings
- **Testing**: Check spam folders for verification emails

## 🔄 Development Workflow

### Local Development
1. **Environment Setup** - Configure all required environment variables
2. **Database Sync** - Run `npm run db:push` after schema changes
3. **Email Testing** - Use real SMTP or development mode
4. **Hot Reload** - Next.js automatic refresh for code changes

### Testing Strategy
- **Unit Tests** - Component and utility function testing
- **Integration Tests** - API route and database testing
- **Email Testing** - SMTP configuration and delivery testing
- **UI Testing** - Cross-browser and mobile testing

### Production Deployment
1. **Environment Variables** - Set all production variables in Vercel
2. **Database Migration** - Ensure schema is up-to-date
3. **Email Production** - Configure production SMTP service
4. **DNS Configuration** - Point domain to Vercel deployment
5. **SSL Certificate** - Automatic via Vercel

## 📄 License

© 2025 Casablanca-Settat Ju-Jitsu League. All rights reserved.

## 🤝 Contributing

This is a private project for the Casablanca-Settat Ju-Jitsu League. For support or feature requests, please contact the league administrators.

### Development Guidelines
- **Code Style** - ESLint + Prettier configuration
- **TypeScript** - Strict mode enabled, full type coverage
- **Git Workflow** - Feature branches with pull requests
- **Testing** - Required for new features
- **Documentation** - Update README for significant changes

---

**Built with ❤️ for the Moroccan Ju-Jitsu community**

*A complete platform solution featuring modern web technologies, enterprise-grade security with Email 2FA, and comprehensive league management tools.*
