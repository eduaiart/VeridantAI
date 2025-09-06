# VeridantAI Company Website

## Overview

This is a modern, full-stack web application for VeridantAI, a software company specializing in AI-driven solutions across education, healthcare, and financial technology. The application serves as the company's primary web presence, featuring comprehensive information about their services, company details, and a contact system for potential clients.

The project implements a clean, professional design with smooth scrolling navigation, responsive layouts, and an integrated contact form that stores submissions in a PostgreSQL database. Built with modern web technologies, it provides an excellent user experience across all devices while maintaining high performance and accessibility standards.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development patterns
- **Routing**: Wouter for lightweight client-side routing with a single-page application structure
- **UI Framework**: shadcn/ui components built on Radix UI primitives for accessible, customizable interface elements
- **Styling**: Tailwind CSS with custom design tokens for consistent theming and responsive design
- **State Management**: TanStack Query (React Query) for server state management and API caching
- **Forms**: React Hook Form with Zod validation for robust form handling and data validation
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework for RESTful API endpoints
- **Language**: TypeScript for full-stack type safety and better developer experience
- **Database ORM**: Drizzle ORM for type-safe database operations and schema management
- **API Design**: RESTful endpoints with structured error handling and request logging middleware
- **Development Setup**: Hot module replacement and development middleware integration

### Data Storage Solutions
- **Primary Database**: PostgreSQL configured through Neon Database serverless platform
- **Schema Management**: Drizzle Kit for database migrations and schema evolution
- **Fallback Storage**: In-memory storage implementation for development and testing scenarios
- **Data Models**: Structured schemas for users and contact form submissions with proper indexing

### Contact Management System
- **Contact Collection**: Comprehensive form capturing first name, last name, email, company, interest area, and message
- **Data Validation**: Client-side and server-side validation using Zod schemas
- **Storage**: Persistent storage in PostgreSQL with automatic timestamp tracking
- **Admin Access**: API endpoints for retrieving all contact submissions for administrative purposes

### Development and Deployment
- **Development Server**: Integrated Vite development server with Express backend
- **Build Process**: Optimized production builds with code splitting and asset optimization
- **Environment Configuration**: Environment-based configuration for database connections and API settings
- **Error Handling**: Comprehensive error boundaries and API error responses with proper HTTP status codes

### External Dependencies

- **Database Provider**: Neon Database (@neondatabase/serverless) for managed PostgreSQL hosting
- **UI Component Library**: Radix UI primitives for accessible, unstyled UI components
- **Styling Framework**: Tailwind CSS for utility-first styling approach
- **Form Management**: React Hook Form with Zod resolvers for type-safe form validation
- **HTTP Client**: Built-in Fetch API with custom wrapper functions for API communication
- **Development Tools**: Replit-specific plugins for development environment integration
- **Build Tooling**: Vite with React plugin and ESBuild for fast compilation and bundling