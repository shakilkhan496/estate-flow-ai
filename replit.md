# MCA Pilot - Merchant Cash Advance CRM

## Overview
MCA Pilot is a comprehensive CRM platform for Merchant Cash Advance (MCA) brokers and ISOs. It provides deal pipeline management, document handling, underwriting tools, role-based access control, and a full Task & Work Management module.

## User Preferences
- Preferred communication style: Simple, everyday language
- Always use proper file structure for features and functions
- Use Redux Toolkit for state management
- Always use mobile responsive design for all pages
- Use Framer Motion for animations
- Futuristic dark theme for admin/task pages (slate gradients, glassmorphism, cyan/blue accents)

## Project Structure
```
app/
├── api/auth/              # Authentication API routes
├── api/tasks/             # Task module API routes
│   ├── spaces/            # CRUD for task spaces (workspaces)
│   ├── lists/             # CRUD for task lists
│   ├── statuses/          # Task status management
│   ├── items/             # CRUD for tasks, subtasks
│   │   └── [id]/          # Single task operations
│   │       ├── comments/  # Task comments
│   │       └── activity/  # Task activity log
│   └── seed/              # Seed demo task data
├── auth/                  # Sign in/Sign up pages
├── dashboard/             # Protected dashboard pages
│   ├── page.tsx           # Dashboard home
│   ├── layout.tsx         # Dashboard layout with sidebar
│   ├── deals/             # Deals with Table & Pipeline views
│   ├── tasks/             # Task & Work Management module
│   │   └── page.tsx       # Airtable-style tasks page with Grid/Kanban/Calendar views
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
│   ├── models/            # Mongoose models
│   │   ├── User.ts
│   │   ├── TaskSpace.ts   # Task workspace/space model
│   │   ├── TaskList.ts    # Task list model
│   │   ├── TaskStatus.ts  # Task status model (per-list)
│   │   ├── Task.ts        # Task model (with subtasks, checklists, CRM links)
│   │   ├── TaskComment.ts # Threaded comments on tasks
│   │   ├── TaskActivity.ts # Activity/audit log for tasks
│   │   └── index.ts       # Model exports
│   ├── mongodb.ts         # MongoDB connection
│   └── utils.ts
└── store/                 # Redux Toolkit store
    ├── index.ts           # Store configuration (auth, ui, adminConfig, tasks)
    ├── hooks.ts           # Typed hooks
    ├── StoreProvider.tsx   # Provider wrapper
    ├── slices/
    │   ├── authSlice.ts
    │   ├── uiSlice.ts
    │   ├── adminConfigSlice.ts
    │   └── taskSlice.ts   # Task module state management
    ├── actions/
    │   ├── authActions.ts
    │   └── taskActions.ts # Task CRUD async actions
    └── selectors/
        ├── authSelectors.ts
        ├── uiSelectors.ts
        ├── adminConfigSelectors.ts
        └── taskSelectors.ts # Task memoized selectors
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
- **Users** - Full user management with create, edit, deactivate features
- **Deals** - Combined view with toggle between Table and Pipeline modes
- **Offers** - Offers table with search, filters, sorting, pagination, CSV export
- **Submissions** - Funder submission tracking
- **Tasks** - Airtable-style task management with Grid, Kanban, and Calendar views
- **Documents** - Document management with file listings
- **Team** - Team member cards with stats (Admin/Manager only)
- **Settings** - Account, notifications, security settings
- **Super Admin** - Configure deal statuses, flags, products, originators, closers (Admin only)

## Task & Work Management Module
Airtable-style task management system with spreadsheet grid interface:

### Hierarchy
- **Space** (workspace area, e.g., "Sales Ops", "Underwriting")
- **List** (where tasks live, belongs to a space)
- **Task** (rows in the grid with inline-editable fields)

### Data Models
- **TaskSpace** - Workspace areas with name, color, icon
- **TaskList** - Lists within spaces, auto-creates default statuses
- **TaskStatus** - Per-list statuses (To Do, In Progress, Review, Blocked, Done)
- **Task** - Full task with title, description, priority, dates, assignee, tags, checklist, custom fields
- **TaskComment** - Threaded comments
- **TaskActivity** - Activity/audit log

### Three Views
1. **Grid View (Primary)** - Airtable-style spreadsheet with columns (Checkbox, Title, Status, Priority, Assignee, Due Date, Tags, Created), inline editing, grouping by status/priority/assignee, bulk actions bar, quick-add row
2. **Kanban View** - Status-based columns with task cards, quick-add per column
3. **Calendar View** - Monthly grid showing tasks by due date

### Row Detail Panel
- Slides in from right (Framer Motion)
- Editable title, description, all fields
- Checklist with progress bar
- Delete action

### Left Sidebar (within tasks page)
- Collapsible workspace tree navigation
- Expandable spaces with nested lists
- Add space/list buttons
- Seed demo data button

### Toolbar
- View tabs (Grid/Kanban/Calendar)
- Search, Filter (priority/status/assignee), Sort, Group By
- Active filter count pill

### API Routes
- `/api/tasks/spaces` - Space CRUD
- `/api/tasks/lists` - List CRUD (auto-creates default statuses)
- `/api/tasks/statuses` - Status management per list
- `/api/tasks/items` - Task CRUD with filtering
- `/api/tasks/items/[id]` - Single task operations
- `/api/tasks/items/[id]/comments` - Task comments
- `/api/tasks/items/[id]/activity` - Task activity log
- `/api/tasks/seed` - Seed demo data

## Role-Based Access Control (RBAC)
The app includes a comprehensive RBAC system with futuristic Role Builder UI.

### Data Models
- **Organization** - PLATFORM, ISO, LENDER, MERCHANT types
- **Role** - System and custom roles with organization type binding
- **Permission** - 40+ permissions grouped by resource
- **RolePermission** - Maps roles to permissions with scopes
- **FieldRule** - Field-level access rules
- **PolicyVersion/PolicySnapshot** - Versioned policy with publish/rollback
- **AuditLog** - Tracks all RBAC changes

### Admin UI
- **Role Builder** (/dashboard/admin/roles) - Futuristic permission matrix editor with dark theme
- **Members** (/dashboard/admin/members) - Invite/manage team members

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
- Rebuilt Task module as Airtable-style spreadsheet interface with Grid, Kanban, Calendar views
- Grid view: inline cell editing, row selection, bulk actions, grouping, sorting, filtering
- Row Detail Panel slides in from right with all editable fields and checklist
- Replaced TaskDetailModal with inline Row Detail Panel
- Fixed Role Builder 403 errors by adding legacy admin role fallback to isSuperAdmin
- Redesigned Role Builder page with futuristic dark theme UI
- Dynamic company name in sidebar from Redux state
