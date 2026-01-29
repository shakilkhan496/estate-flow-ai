# MCA Pilot - Merchant Cash Advance CRM

## Overview
MCA Pilot is a comprehensive CRM platform for Merchant Cash Advance (MCA) brokers and ISOs. It provides deal pipeline management, document handling, underwriting tools, and role-based access control.

## User Preferences
Preferred communication style: Simple, everyday language.

## Project Structure
```
app/
├── api/
│   └── auth/          # Authentication API routes
│       ├── login/     # User login
│       ├── logout/    # User logout
│       ├── me/        # Get current user
│       └── register/  # User registration
├── auth/
│   ├── signin/        # Sign in page
│   └── signup/        # Sign up page
├── dashboard/         # Protected dashboard
├── globals.css        # Tailwind CSS styles
├── layout.tsx         # Root layout
└── page.tsx           # Landing page
src/
├── components/ui/     # shadcn/ui components
├── hooks/             # Custom React hooks
└── lib/
    ├── auth.ts        # Authentication utilities
    ├── models/        # Mongoose models
    │   └── User.ts    # User model with roles
    ├── mongodb.ts     # MongoDB connection
    └── utils.ts       # Utility functions
```

## Key Features
- Landing page showcasing MCA Pilot features
- Role-based authentication (Admin, Manager, Broker, User)
- MongoDB database with Mongoose ODM
- shadcn/ui components with Tailwind CSS
- JWT-based session management
- Protected dashboard routes

## Role System
User roles with hierarchical permissions:
- **Admin** - Full system access, manage all users and settings
- **Manager** - Team oversight, view all deals
- **Broker** - Create and manage assigned deals
- **User** - Limited access, view only assigned items

The first registered user automatically becomes an Admin.

## Authentication
JWT tokens stored in HTTP-only cookies for security:
- `/api/auth/register` - Create new account
- `/api/auth/login` - Sign in
- `/api/auth/logout` - Sign out
- `/api/auth/me` - Get current user

## Database
MongoDB with Mongoose ODM. Connection pooling enabled.

Environment variable required:
- `MONGODB_URI` - MongoDB connection string

## Development
```bash
npm run dev      # Start development server on port 5000
npm run build    # Build for production
npm run start    # Start production server
```

## Tech Stack
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui (Radix UI primitives)
- MongoDB / Mongoose
- bcryptjs (password hashing)
- jsonwebtoken (JWT)
- Lucide React (icons)

## Planned Features (from MCA Pilot spec)
- Deal Pipeline & Deal Management
- Document Upload & Management
- Underwriting & Deal Evaluation
- Lender Submissions & Offers Pipeline
- Team Management
- Follow-up Automation

## Recent Changes
- Created MCA Pilot landing page with features section
- Implemented role-based authentication system
- Added User model with Admin/Manager/Broker/User roles
- Built sign-in and sign-up pages with shadcn/ui
- Created protected dashboard with role-aware navigation
- Set up JWT authentication with HTTP-only cookies
