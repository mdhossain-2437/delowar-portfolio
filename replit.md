# Overview

This is a modern portfolio website for Delowar Hossain, a web developer and AI learner. The project is built as a full-stack web application using React for the frontend and Express.js for the backend, with a PostgreSQL database for data persistence. The portfolio showcases skills, projects, and professional experience with a clean, modern dark theme design featuring gradient effects and smooth animations.

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
- **Storage**: In-memory storage implementation with interface for easy database migration
- **API Design**: RESTful API structure with `/api` prefix for all endpoints

## Component Structure
- **Layout Components**: Navigation, Hero, About, Skills, Projects, Experience, Contact, Footer
- **UI Components**: Comprehensive shadcn/ui component library with custom theming
- **Custom Hooks**: Typing animations, scroll reveal effects, mobile detection
- **Shared Types**: Common TypeScript interfaces in shared directory

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