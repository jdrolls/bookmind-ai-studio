# BookMind AI Studio - Project Structure

## Overview
This document outlines the project structure for the BookMind AI Studio application, which will help independent authors and small publishers develop full-length non-fiction books using AI assistance.

## Directory Structure

### Root Directory
- `migrations/` - Contains D1 database migration files
  - `0001_initial.sql` - Initial database setup with counters and access logs tables

### Source Code (`src/`)
- `app/` - Next.js pages and server components
  - `counter.ts` - Server actions for database operations
  - `globals.css` - Global CSS styles
  - `layout.tsx` - Root layout component
  - `page.tsx` - Main page component with counter example

- `components/` - Reusable React components
  - `ui/` - UI components from shadcn/ui library
    - Contains 40+ UI components including:
      - Layout components (Card, Dialog, Drawer, etc.)
      - Form components (Input, Checkbox, Select, etc.)
      - Navigation components (Tabs, Menubar, etc.)
      - Feedback components (Toast, Alert, etc.)

- `hooks/` - Custom React hooks

- `lib/` - Utility functions

### Configuration Files
- `wrangler.toml` - Cloudflare Workers configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `components.json` - shadcn/ui components configuration
- `next.config.ts` - Next.js configuration

## Database Structure
The application uses Cloudflare D1 database with the following tables:

1. `counters` - For tracking various counters
   - `id` - Primary key
   - `name` - Counter name (unique)
   - `value` - Counter value
   - `created_at` - Creation timestamp

2. `access_logs` - For tracking page access
   - `id` - Primary key
   - `ip` - User IP address
   - `path` - Accessed path
   - `accessed_at` - Access timestamp

## UI Component Library
The project includes shadcn/ui, a comprehensive component library built on Radix UI and styled with Tailwind CSS. These components will be used to implement the BookMind AI Studio interface, including:

- Two-pane layout (Outline on left, Text Editor on right)
- Rich text editor with formatting capabilities
- Dialog boxes for AI operations
- Forms for user input
- Navigation components for the wizard-like workflow

## Next Steps for Implementation
1. Design and implement the database schema for book projects
2. Create the main application layout with the two-pane interface
3. Implement the step-by-step workflow components
4. Integrate with OpenRouter for AI operations
5. Develop the core features as outlined in the requirements
