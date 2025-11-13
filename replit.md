# Overview

This is a comprehensive personal website platform for Delowar Hossain, featuring three integrated modules: (1) **Public Portfolio** - showcasing projects, blog, timeline, achievements, and tech stack; (2) **Private Workspace** - managing tasks, notes, code snippets, learning tracker, time tracking, habits, and calendar; (3) **Business Hub** - handling clients, proposals, invoices, and finance. Built as a full-stack application with React/TypeScript frontend, Express.js backend, PostgreSQL database, and comprehensive authentication system.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent, professional UI components
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state management and data fetching
- **Animations**: Framer Motion for smooth page transitions and micro-interactions
- **Build Tool**: Vite for fast development and optimized production builds

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Authentication**: Passport.js with local strategy and bcrypt password hashing
- **Storage**: Mock storage layer (development) - interfaces ready for database connection
- **API Design**: RESTful API with modular routers (auth, content, workspace, business)
- **Session Management**: Express-session with connect-pg-simple for persistence

## Enhanced Page Structure
### Public Portfolio
- **Home**: Hero with 3D elements, skills showcase, featured projects
- **Projects**: Filterable portfolio with category tags and search
- **Blog**: Rich text blog posts with categories and tags
- **Timeline**: Career journey with education, work experience, milestones
- **Achievements**: Statistics, badges, certifications, metrics dashboard
- **Stack**: Comprehensive tech stack - devices, tools, IDE setup, workflow
- **Skills**: Interactive skill categorization with proficiency levels
- **Contact**: Email integration for inquiries and networking

### Private Workspace
- **Tasks**: Kanban-style task board (To Do, In Progress, Done)
- **Notes**: Rich text note-taking with categories
- **Snippets**: Code snippet library with syntax highlighting
- **Learning**: Learning tracker for courses and skills progress
- **Time Tracker**: Project time logging and analytics
- **Habits**: Habit tracking with streaks and goals
- **Calendar**: Event scheduling and reminders

### Business Hub
- **Clients**: Client management with contact details and projects
- **Proposals**: Proposal creation and status tracking
- **Invoices**: Invoice generation with payment tracking
- **Finance**: Revenue analytics and expense management

## Component Structure
- **Layout Components**: Header/Navigation, MainLayout, Footer
- **Public Pages**: Home, About, Projects, Blog, Timeline, Achievements, Stack
- **Workspace Pages**: Tasks, Notes, Snippets, Learning, Time, Habits, Calendar
- **Business Pages**: Clients, Proposals, Invoices, Finance Dashboard
- **UI Components**: Comprehensive shadcn/ui library (Cards, Badges, Tabs, Forms, etc.)
- **Custom Hooks**: Typing animations, scroll reveal effects, mobile detection
- **Shared Types**: Full type definitions in shared/schema.ts (30+ table schemas)

## Development Environment
- **Development Server**: Vite dev server with hot module replacement
- **Build Process**: Vite for frontend, esbuild for backend bundling
- **Code Quality**: TypeScript for type checking, ESModules throughout
- **Path Aliases**: Configured for clean imports (@/, @shared/, @assets/)

## Design System
- **Theme**: Dark theme with purple-to-blue gradient color scheme
- **Typography**: Inter font for body text, JetBrains Mono for code elements
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Color Palette**: CSS custom properties for consistent theming

# External Dependencies

## Database
- **PostgreSQL**: Primary database using Neon serverless PostgreSQL
- **Drizzle ORM**: Type-safe database operations with migration support
- **Connection**: Environment-based DATABASE_URL configuration

## UI/UX Libraries
- **Radix UI**: Unstyled, accessible UI primitives for complex components
- **shadcn/ui**: Pre-built component library based on Radix UI
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Framer Motion**: Animation library for smooth transitions and interactions

## Development Tools
- **Vite**: Fast build tool with React plugin and runtime error overlay
- **TypeScript**: Type safety across frontend, backend, and shared code
- **TanStack React Query**: Server state management and caching
- **Wouter**: Lightweight routing library

## External Services
- **Replit Integration**: Development environment with cartographer plugin
- **Font APIs**: Google Fonts for Inter and JetBrains Mono typography
- **Font Awesome**: Icon library for social media and UI icons

## Form Handling
- **React Hook Form**: Form state management with validation
- **Hookform Resolvers**: Integration with validation libraries
- **Zod**: Runtime type validation for forms and API data

## Utilities
- **date-fns**: Date manipulation and formatting
- **clsx & twMerge**: Conditional CSS class handling
- **nanoid**: Unique ID generation for various use cases