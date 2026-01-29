# Multi-Role Admin Dashboard Starter Template

## Overview
A Next.js 14 admin dashboard starter template with multi-role support, built on Bootstrap 5 and React Bootstrap. This template provides a solid foundation for building admin panels with role-based access control.

## User Preferences
Preferred communication style: Simple, everyday language.

## Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── (admin)/           # Protected admin pages
│   └── (other)/           # Public pages (auth, error pages)
├── assets/                 # Static assets (images, SCSS)
├── components/             # Reusable components
│   ├── layout/            # Layout components (Header, Footer, Sidebar)
│   └── wrappers/          # Context providers and wrappers
├── context/                # React contexts
│   ├── constants.ts       # App configuration
│   └── RoleContext.tsx    # Role-based access control
├── lib/                    # Utility libraries
│   └── mongodb.ts         # MongoDB/Mongoose connection
└── types/                  # TypeScript type definitions
```

## Key Features
- Multi-role authentication system (Admin, Manager, User)
- MongoDB database with Mongoose ODM
- Responsive sidebar navigation
- Dashboard analytics with charts (ApexCharts)
- Form components with validation (React Hook Form + Yup)

## Database
MongoDB is configured with Mongoose. The connection is managed in `src/lib/mongodb.ts`.

Usage in API routes:
```typescript
import connectDB from '@/lib/mongodb'

export async function GET() {
  await connectDB()
  // Your database operations here
}
```

Environment variable required:
- `MONGODB_URI` - MongoDB connection string

## Role System
The app includes a `RoleContext` that provides:
- `user` - Current user object with role
- `hasPermission(roles)` - Check if user has required role
- `isAdmin` - Boolean for admin check
- `isManager` - Boolean for manager or admin check

Roles: `admin`, `manager`, `user`

## Configuration
Edit `src/context/constants.ts` to customize:
- `APP_NAME` - Application name shown in header/footer
- `DEFAULT_PAGE_TITLE` - Browser tab title

## Development
```bash
npm run dev      # Start development server on port 5000
npm run build    # Build for production
npm run start    # Start production server
```

## Tech Stack
- Next.js 14 (App Router)
- React 18
- TypeScript
- Bootstrap 5 / React Bootstrap
- MongoDB / Mongoose
- SCSS
- ApexCharts
- React Hook Form + Yup

## Recent Changes
- Added MongoDB/Mongoose integration with connection pooling
- Removed LAHomes real estate branding
- Replaced logo images with text-based branding
- Restructured navigation for generic admin use
- Added RoleContext for multi-role support
- Updated authentication pages
