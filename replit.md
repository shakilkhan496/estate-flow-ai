# MCA Pilot - Merchant Cash Advance CRM

## Overview
MCA Pilot is a comprehensive CRM platform for Merchant Cash Advance (MCA) brokers and ISOs. It provides deal pipeline management, document handling, underwriting tools, and role-based access control.

## User Preferences
- Preferred communication style: Simple, everyday language
- Always use proper file structure for features and functions
- Use Redux Toolkit for state management
- Always use mobile responsive design for all pages
- Use Framer Motion for animations

## Project Structure
```
app/
├── api/auth/              # Authentication API routes
├── auth/                  # Sign in/Sign up pages
├── dashboard/             # Protected dashboard pages
│   ├── page.tsx           # Dashboard home
│   ├── layout.tsx         # Dashboard layout with sidebar
│   ├── deals/             # Deals with Table & Pipeline views
│   ├── documents/         # Documents management page
│   ├── team/              # Team management page
│   ├── settings/          # Settings page
│   └── admin/             # Super Admin settings (Admin only)
├── globals.css
├── layout.tsx             # Root layout with Redux Provider
└── page.tsx               # Landing page
src/
├── components/
│   ├── layout/            # Layout components
│   │   ├── Sidebar.tsx    # Animated sidebar with mobile support
│   │   └── DashboardLayout.tsx
│   └── ui/                # shadcn/ui components
├── lib/
│   ├── auth.ts            # Authentication utilities
│   ├── models/User.ts     # User model
│   ├── mongodb.ts         # MongoDB connection
│   └── utils.ts
└── store/                 # Redux Toolkit store
    ├── index.ts           # Store configuration
    ├── hooks.ts           # Typed hooks
    ├── StoreProvider.tsx  # Provider wrapper
    ├── slices/            # Redux slices
    ├── actions/           # Async actions
    └── selectors/         # Memoized selectors
```

## Key Features
- Mobile-responsive design on all pages
- Animated sidebar with Framer Motion (open/close, mobile hamburger menu)
- Role-based authentication (Admin, Manager, Broker, User)
- Redux Toolkit for centralized state management
- Sample data on all dashboard pages
- JWT-based session with HTTP-only cookies

## Tech Stack
- Next.js 16 (App Router)
- React 19
- TypeScript
- Redux Toolkit + React-Redux
- Framer Motion (animations)
- Tailwind CSS v4
- shadcn/ui (Radix UI)
- MongoDB / Mongoose
- bcryptjs, jsonwebtoken
- Lucide React (icons)

## Dashboard Pages
- **Dashboard** - Overview with stats and recent deals
- **Deals** - Combined view with toggle between Table and Pipeline modes:
  - **Table View** - Full spreadsheet with columns (Company, Deal ID, Status, Flags, DBA, Owner, Phone, Email, Products, Notes, Originators, Closers, Date Created/Updated, GURL, Max Offer, Monthly Rev, Owners count)
  - **Pipeline View** - Kanban board with 15 stages (New Application, Missing Documents, Ready to Submit, Submitted, Resubmitting, Approved, Offer Selected, Offer Pitched, Repricing, Offer Accepted, Received DL/VC, Contracts Requested, Contracts Sent, Contracts Signed, Final Review). Drag-and-drop deals between stages.
- **Documents** - Document management with file listings
- **Team** - Team member cards with stats (Admin/Manager only)
- **Settings** - Account, notifications, security settings
- **Super Admin** - Configure deal statuses, flags, products, originators, closers (Admin only)

## Environment Variables
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret (required)

## Development
```bash
npm run dev      # Start on port 5000
npm run build    # Build for production
npm run start    # Production server
```

## Recent Changes
- Added Framer Motion for smooth animations
- Created animated sidebar with mobile hamburger menu
- Built responsive dashboard layout
- Created Deals page with full table view matching MCA CRM standards
- Created Documents page with file management
- Created Team page with member cards
- Created Settings page with account options
- Added Super Admin page for configuring deal options (statuses, flags, products, originators, closers)
- Sidebar state persists via localStorage
- All pages are fully mobile responsive
