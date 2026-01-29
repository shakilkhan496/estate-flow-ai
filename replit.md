# MCA Pilot - Merchant Cash Advance CRM

## Overview
MCA Pilot is a comprehensive CRM platform for Merchant Cash Advance (MCA) brokers and ISOs. It provides deal pipeline management, document handling, underwriting tools, and role-based access control.

## User Preferences
- Preferred communication style: Simple, everyday language
- Always use proper file structure for features and functions
- Use Redux Toolkit for state management

## Project Structure
```
app/
├── api/
│   └── auth/              # Authentication API routes
│       ├── login/         # User login
│       ├── logout/        # User logout
│       ├── me/            # Get current user
│       └── register/      # User registration
├── auth/
│   ├── signin/            # Sign in page
│   └── signup/            # Sign up page
├── dashboard/             # Protected dashboard
├── globals.css            # Tailwind CSS styles
├── layout.tsx             # Root layout (with Redux Provider)
└── page.tsx               # Landing page
src/
├── components/ui/         # shadcn/ui components
├── hooks/                 # Custom React hooks
├── lib/
│   ├── auth.ts            # Authentication utilities (server)
│   ├── models/            # Mongoose models
│   │   └── User.ts        # User model with roles
│   ├── mongodb.ts         # MongoDB connection
│   └── utils.ts           # Utility functions
└── store/                 # Redux Toolkit store
    ├── index.ts           # Store configuration
    ├── hooks.ts           # Typed Redux hooks (useAppDispatch, useAppSelector)
    ├── StoreProvider.tsx  # Redux Provider wrapper
    ├── actions/           # Async thunk actions
    │   └── authActions.ts # Auth-related actions (login, register, logout)
    ├── selectors/         # Memoized selectors
    │   ├── authSelectors.ts
    │   └── uiSelectors.ts
    └── slices/            # Redux slices
        ├── authSlice.ts   # Auth state (user, isAuthenticated, loading)
        └── uiSlice.ts     # UI state (sidebar, toasts, page loading)
```

## Key Features
- Landing page showcasing MCA Pilot features
- Role-based authentication (Admin, Manager, Broker, User)
- Redux Toolkit for centralized state management
- MongoDB database with Mongoose ODM
- shadcn/ui components with Tailwind CSS
- JWT-based session management
- Protected dashboard routes with middleware

## State Management (Redux Toolkit)
```typescript
// Using typed hooks
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectUser, selectIsAuthenticated } from '@/store/selectors/authSelectors';
import { loginUser, logoutUser } from '@/store/actions/authActions';

// In components
const dispatch = useAppDispatch();
const user = useAppSelector(selectUser);
const isAuthenticated = useAppSelector(selectIsAuthenticated);

// Dispatch actions
dispatch(loginUser(email, password));
dispatch(logoutUser());
```

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

Environment variables required:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT signing (required, no fallback)

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
- Redux Toolkit + React-Redux
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
- Integrated Redux Toolkit with proper file structure (store/slices/actions/selectors)
- Created StoreProvider wrapper for Next.js App Router
- Added typed Redux hooks (useAppDispatch, useAppSelector)
- Created auth and UI slices with actions
- Added auth actions for login, register, logout, fetchCurrentUser
- Created memoized selectors for auth and UI state
