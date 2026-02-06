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
│   │   ├── page.tsx       # Tasks page with List/Board/Calendar views
│   │   └── TaskDetailModal.tsx  # Task detail modal component
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
- **Tasks** - Full Task & Work Management module (see below)
- **Documents** - Document management with file listings
- **Team** - Team member cards with stats (Admin/Manager only)
- **Settings** - Account, notifications, security settings
- **Super Admin** - Configure deal statuses, flags, products, originators, closers (Admin only)

## Task & Work Management Module
ClickUp-like task management system with:

### Hierarchy
- **Space** (workspace area, e.g., "Sales Ops", "Underwriting")
- **List** (where tasks live, belongs to a space)
- **Task** (with subtasks, checklists, comments)

### Data Models
- **TaskSpace** - Workspace areas with name, color, icon
- **TaskList** - Lists within spaces, auto-creates default statuses
- **TaskStatus** - Per-list statuses (To Do, In Progress, Review, Blocked, Done) with types (open/in_progress/blocked/done)
- **Task** - Full task with title, description, priority (low/medium/high/urgent), dates, assignee, watchers, tags, checklist items, CRM entity links, custom fields
- **TaskComment** - Threaded comments with @mentions
- **TaskActivity** - Activity log tracking status changes, assignee changes, etc.

### Three Views
1. **List View** - Table layout with columns (Title, Status, Priority, Assignee, Due Date, Tags), quick-add row, inline editing
2. **Board/Kanban View** - Drag-and-drop columns by status, task cards with priority badges, assignee avatars, quick-add per column
3. **Calendar View** - Monthly grid showing tasks by due date, day detail panel, prev/next navigation

### Task Detail Modal
- Editable title and description (click-to-edit)
- Status and priority selectors
- Due date picker
- Checklist with progress bar
- Subtasks list with add functionality
- CRM entity links (lead, merchant, deal, submission, offer, funding, etc.)
- Threaded comments
- Activity timeline
- Delete/archive actions

### API Routes
- `/api/tasks/spaces` - Space CRUD
- `/api/tasks/lists` - List CRUD (auto-creates default statuses)
- `/api/tasks/statuses` - Status management per list
- `/api/tasks/items` - Task CRUD with filtering (by list, space, assignee, status, priority, search, date range)
- `/api/tasks/items/[id]` - Single task with subtasks
- `/api/tasks/items/[id]/comments` - Task comments
- `/api/tasks/items/[id]/activity` - Task activity log
- `/api/tasks/seed` - Seed demo data (admin only)

### MCA-Specific Demo Data (via seed)
- Sales Ops space: Lead Intake, Submission Packaging lists
- Underwriting space: Underwriting Review, Offer Follow-up lists
- Funding & Collections space: Funding & Closing, Renewals lists
- Sample tasks with checklists, priorities, tags

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
- Built complete Task & Work Management module with List, Board, Calendar views
- Created TaskDetailModal with subtasks, checklists, comments, CRM linking, activity log
- Added 6 Mongoose models for task system (TaskSpace, TaskList, TaskStatus, Task, TaskComment, TaskActivity)
- Built full REST API for task management with filtering and activity tracking
- Added Redux slice, actions, and selectors for task state management
- Added seed endpoint for demo task data
- Added Tasks link to sidebar navigation
- Redesigned Role Builder page with futuristic dark theme UI
- Dynamic company name in sidebar from Redux state
