# Casablanca-Settat Ju-Jitsu League Platform

A modern, secure, and multilingual full-stack web application for the regional Ju-Jitsu League of Casablanca-Settat under the Moroccan Federation.

## 🏆 Features

### Public Website
- **Landing Page** - Introduction to the league with achievements and statistics
- **About Page** - League history, mission, key people, and timeline
- **Multilingual Support** - Arabic (🇲🇦), French (🇫🇷), and English (🇬🇧)
- **Responsive Design** - Mobile-first, fully responsive across all devices
- **Modern UI** - 2025 futuristic design with league colors

### Admin Dashboard (`/secret-dashboard-2025`)
- **Secure Authentication** - JWT-based login for admin users only
- **Dashboard KPIs** - Real-time statistics and overview
- **Club Management** - CRUD operations for affiliated clubs
- **Athlete Management** - Complete athlete profiles with search and filtering
- **Insurance Tracking** - Season-based insurance management
- **Championship Management** - Event creation and club registration tracking
- **League Teams** - 1st and 2nd division team management

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS v4
- **UI Components**: shadcn/ui, Radix UI primitives
- **Backend**: tRPC for type-safe APIs
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Custom JWT-based authentication
- **Styling**: TailwindCSS with custom theme colors
- **Icons**: Lucide React
- **Notifications**: Sonner (toast notifications)

## 🎨 Design System

### Colors
- **Primary Red**: `#d62027` (League primary color)
- **Primary Green**: `#017444` (League secondary color)
- **White**: `#ffffff` (Neutral)

### Typography
- **Font**: Inter (clean, modern sans-serif)
- **Weights**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
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
   
   Update the `.env` file with your database connection and other settings:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/lrcsjj_webapp"
   JWT_SECRET="your-super-secret-jwt-key"
   ADMIN_DEFAULT_EMAIL="admin@lrcsjj.ma"
   ADMIN_DEFAULT_PASSWORD="AdminPass2025!"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push database schema
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

Access the admin dashboard at: `http://localhost:3000/secret-dashboard-2025`

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                 # Landing page
│   ├── about/page.tsx           # About page
│   ├── login/page.tsx           # Admin login
│   ├── secret-dashboard-2025/   # Admin dashboard
│   └── api/trpc/               # tRPC API routes
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── admin/                  # Admin-specific components
│   └── public/                 # Public site components
├── lib/
│   ├── auth.ts                 # Authentication utilities
│   ├── prisma.ts              # Database client
│   ├── trpc.ts                # tRPC server config
│   ├── trpc-client.ts         # tRPC client config
│   ├── trpc-provider.tsx      # tRPC React provider
│   └── routers/               # tRPC route handlers
│       ├── auth.ts
│       ├── clubs.ts
│       ├── athletes.ts
│       └── index.ts
prisma/
├── schema.prisma              # Database schema
└── seed.ts                    # Database seeding script
```

## 🗄 Database Schema

### Core Models
- **Admin** - System administrators
- **Club** - Affiliated Ju-Jitsu clubs
- **Athlete** - Individual athletes
- **Season** - Competition seasons (e.g., 2024-2025)
- **Insurance** - Athlete insurance payments per season
- **Championship** - Competition events
- **LeagueTeam** - 1st and 2nd division teams
- **LeagueTeamMember** - Team assignments

## 📋 Available Scripts

```bash
# Development
npm run dev                    # Start development server
npm run build                  # Build for production
npm run start                  # Start production server
npm run lint                   # Run ESLint

# Database
npm run db:generate           # Generate Prisma client
npm run db:push              # Push schema to database
npm run db:migrate           # Run database migrations
npm run db:seed              # Seed database with sample data
npm run db:studio            # Open Prisma Studio
npm run db:reset             # Reset and reseed database
```

## 🌐 Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
2. **Set environment variables** in Vercel dashboard
3. **Deploy** - Vercel will automatically build and deploy

### Docker (Alternative)

```bash
# Build Docker image
docker build -t lrcsjj-webapp .

# Run container
docker run -p 3000:3000 --env-file .env lrcsjj-webapp
```

### Environment Variables for Production

```env
DATABASE_URL="your-production-postgresql-url"
JWT_SECRET="your-production-jwt-secret"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

## 🔐 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt with configurable rounds
- **Route Protection** - Server-side authentication checks
- **Admin-Only Access** - Two-admin system stored in database
- **Secure Routes** - Obfuscated admin route naming

## 🌍 Internationalization

The application supports three languages:
- **Arabic (AR)** 🇲🇦
- **French (FR)** 🇫🇷  
- **English (EN)** 🇬🇧

Language switching is available in the navigation header.

## 🏅 Federation Compliance

The platform displays logos and links for:
- **Casablanca-Settat Regional League**
- **Royal Moroccan Ju-Jitsu Federation**
- **North African Union of Ju-Jitsu**
- **African Union of Ju-Jitsu**
- **JJIF (International Ju-Jitsu Federation)**

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify PostgreSQL is running
   - Check DATABASE_URL in .env file
   - Ensure database exists

2. **Authentication Not Working**
   - Check JWT_SECRET is set
   - Verify admin user exists in database
   - Clear browser localStorage

3. **Build Errors**
   - Run `npm run db:generate` after schema changes
   - Clear `.next` folder and rebuild

## 📄 License

© 2025 Casablanca-Settat Ju-Jitsu League. All rights reserved.

## 🤝 Contributing

This is a private project for the Casablanca-Settat Ju-Jitsu League. For support or feature requests, please contact the league administrators.

---

**Built with ❤️ for the Moroccan Ju-Jitsu community**
