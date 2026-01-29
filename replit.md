# replit.md

## Overview

This is a Next.js 16 starter project using the App Router architecture. It's a fresh scaffolded application created with `create-next-app`, providing a foundation for building React-based web applications with server-side rendering capabilities. The project uses TypeScript for type safety and Tailwind CSS v4 for styling.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Next.js 16 with App Router (located in `/app` directory)
- **UI Library**: React 19
- **Styling**: Tailwind CSS v4 with PostCSS integration
- **Typography**: Geist font family (sans and mono variants) loaded via `next/font`

### Routing Structure
- Uses Next.js App Router with file-based routing
- Root layout defined in `app/layout.tsx` applies global styles and fonts
- Main page component in `app/page.tsx`

### Design Patterns
- **Component Architecture**: React functional components with TypeScript
- **Styling Approach**: Utility-first CSS with Tailwind, supporting dark mode via `prefers-color-scheme`
- **Path Aliases**: Configured with `@/*` mapping to project root for cleaner imports

### Build Configuration
- TypeScript configured with strict mode and ES2017 target
- Module resolution set to "bundler" for Next.js compatibility
- ESLint configured with Next.js recommended rules

## External Dependencies

### Core Dependencies
- `next`: 16.1.6 - React framework for production
- `react`: 19.2.3 - UI component library
- `react-dom`: 19.2.3 - React DOM renderer

### Development Dependencies
- `tailwindcss`: v4 - Utility-first CSS framework
- `@tailwindcss/postcss`: v4 - PostCSS plugin for Tailwind
- `typescript`: v5 - Type checking
- `eslint` + `eslint-config-next`: Code linting

### External Services
- None currently configured. The project is ready for integrations like databases, authentication, or third-party APIs as needed.