# Multi-Role Admin Dashboard Starter Template

## Overview
A Next.js 14 admin dashboard starter template with multi-role support, built with shadcn/ui and Tailwind CSS. This template provides a solid foundation for building admin panels with role-based access control.

## User Preferences
Preferred communication style: Simple, everyday language.

## Project Structure
```
app/                        # Next.js App Router pages
├── globals.css            # Tailwind CSS and shadcn variables
├── layout.tsx             # Root layout
└── page.tsx               # Home page
src/
├── components/             # Reusable components
│   └── ui/                # shadcn/ui components
├── hooks/                  # Custom React hooks
└── lib/                    # Utility libraries
    ├── mongodb.ts         # MongoDB/Mongoose connection
    └── utils.ts           # Tailwind utility functions (cn)
```

## Key Features
- Multi-role authentication system (Admin, Manager, User)
- MongoDB database with Mongoose ODM
- shadcn/ui components (Button, Card, Input, Dialog, Table, etc.)
- Tailwind CSS styling with dark mode support
- Form components with validation (React Hook Form + Yup)

## shadcn/ui Components
Available components in `src/components/ui/`:
- Avatar, Badge, Button, Card, Checkbox
- Dialog, Dropdown Menu, Input, Label
- Select, Separator, Switch, Table
- Tabs, Textarea, Tooltip

Usage:
```typescript
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

<Button variant="outline">Click me</Button>
<Card>
  <CardHeader><CardTitle>Title</CardTitle></CardHeader>
  <CardContent>Content here</CardContent>
</Card>
```

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
- Tailwind CSS
- shadcn/ui (Radix UI primitives)
- MongoDB / Mongoose
- Lucide React (icons)
- React Hook Form + Yup

## Recent Changes
- Added shadcn/ui component library with Tailwind CSS
- Added MongoDB/Mongoose integration with connection pooling
- Removed LAHomes real estate branding
- Replaced logo images with text-based branding
- Restructured navigation for generic admin use
- Added RoleContext for multi-role support
- Updated authentication pages
