# Copilot Instructions for Casablanca-Settat Ju-Jitsu League Platform

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a modern, secure, and multilingual full-stack web application for the Casablanca-Settat Ju-Jitsu League under the Moroccan Federation.

## Tech Stack
- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS, shadcn/ui
- **Backend**: tRPC, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: Custom JWT-based authentication for admin users
- **Internationalization**: next-i18next with Arabic, French, and English
- **Styling**: TailwindCSS with custom theme colors

## Design Guidelines
- **Colors**: Primary red (#d62027), green (#017444), white (#ffffff)
- **Design**: 2025 futuristic UI, mobile-first, fully responsive
- **Components**: Clean componentized structure using shadcn/ui
- **Font**: Modern clean font (Inter or Poppins)
- **Theme**: Support for dark/light theme

## Architecture
- **Component Structure**: 
  - `components/ui` - shadcn/ui components
  - `components/admin` - Admin dashboard components
  - `components/public` - Public site components
- **Pages Structure**:
  - `/` - Landing page
  - `/about` - About page
  - `/login` - Admin login
  - `/secret-dashboard-2025` - Admin dashboard
- **Database Models**: Club, Athlete, Insurance, Season, Admin, Championship, LeagueTeam

## Security
- Admin routes protected with JWT authentication
- Only two admin users stored in database with bcrypt-hashed passwords
- Secure route naming (not /admin but /secret-dashboard-2025)

## Features
- Public site with landing and about pages
- Secure admin dashboard with KPIs
- CRUD operations for clubs, athletes, insurance, championships
- Multilingual support (AR, FR, EN)
- Backup strategy for database

## Development Guidelines
- Use TypeScript for all code
- Follow Next.js 14 App Router patterns
- Use Prisma for database operations
- Implement tRPC for type-safe API calls
- Use proper error handling and validation
- Follow responsive design principles
- Implement proper SEO practices
