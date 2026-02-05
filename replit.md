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
│   ├── team/              # Users management page (create, edit, delete users)
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
- **Users** - Full user management with create, edit, deactivate features. Includes:
  - User cards with name, email, phone, role, and status
  - Add new user with name, email, phone, password, and role
  - Edit existing users including password reset
  - Activate/deactivate users
  - Search and filter users
- **Deals** - Combined view with toggle between Table and Pipeline modes:
  - **Table View** - Full spreadsheet with columns (Company, Deal ID, Status, Flags, DBA, Owner, Phone, Email, Products, Notes, Originators, Closers, Date Created/Updated, GURL, Max Offer, Monthly Rev, Owners count)
  - **Pipeline View** - Kanban board with 15 stages (New Application, Missing Documents, Ready to Submit, Submitted, Resubmitting, Approved, Offer Selected, Offer Pitched, Repricing, Offer Accepted, Received DL/VC, Contracts Requested, Contracts Sent, Contracts Signed, Final Review). Features include:
    - Drag-and-drop deals between stages
    - Compact/Expanded card toggle (show just company name or full details)
    - Last activity timestamps on deal cards
    - Stage transition history tracking (records when deals move between stages)
    - Sticky stage headers with synchronized horizontal scrolling
    - Inline "Next" button to move deals to next stage without dragging
    - Stage collapsing - click X on stage header to collapse, click collapsed stage to expand
    - "Hide All Stages" / "Show All Stages" buttons for quick bulk collapse/expand
- **Offers** - Offers table with columns: Deal, Funder, Status, Amount, Rate, Payback, Term, Payment, Commission, Phone, Notes, Tags, AI, Originator, Created. Includes search, filters, sorting, pagination, and CSV export
- **Submissions** - Funder submission tracking with status (declined, approved, sent, errored), responses, AI flags, pagination
- **Documents** - Document management with file listings
- **Team** - Team member cards with stats (Admin/Manager only)
- **Settings** - Account, notifications, security settings
- **Super Admin** - Configure deal statuses, flags, products, originators, closers (Admin only)

## Role-Based Access Control (RBAC)
The app includes a comprehensive RBAC system with:

### Data Models
- **Organization** - PLATFORM, ISO, LENDER, MERCHANT types
- **Role** - System and custom roles with organization type binding
- **Permission** - 40+ permissions grouped by resource (Submission, Deal, Offer, etc.)
- **RolePermission** - Maps roles to permissions with scopes (OWN, ASSIGNED, TEAM, ORG, GLOBAL)
- **FieldRule** - Field-level access rules (READONLY, HIDDEN, EDITABLE)
- **PolicyVersion/PolicySnapshot** - Versioned policy with publish/rollback
- **AuditLog** - Tracks all RBAC changes

### Default Roles
- PLATFORM: SUPER_ADMIN, PLATFORM_SUPPORT, COMPLIANCE_AUDITOR, ACCOUNTING
- ISO: ISO_OWNER, ISO_MANAGER, SENIOR_BROKER, JUNIOR_BROKER
- LENDER: LENDER_ADMIN, UNDERWRITER, FUNDING_DESK, PORTFOLIO_MANAGER
- MERCHANT: MERCHANT
- ANY: CLOSING_AGENT

### Admin UI
- **Role Builder** (/dashboard/admin/roles) - Permission matrix editor
- **Members** (/dashboard/admin/members) - Invite/manage team members

### API Routes
- `/api/admin/roles` - Role CRUD
- `/api/admin/permissions/matrix` - Permission matrix
- `/api/admin/permissions/toggle` - Toggle permissions
- `/api/admin/members` - Member management
- `/api/admin/policy/publish` - Publish policy
- `/api/admin/policy/rollback` - Rollback to snapshot
- `/api/admin/break-glass/restore-super-admin` - Emergency access restore
- `/api/me` - Current user with permissions

## Environment Variables
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret (required)
- `BREAK_GLASS_TOKEN` - (Optional) Token for emergency admin restore

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
