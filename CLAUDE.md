# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Language Guidelines
- **ภาษาไทย**: ตอบเป็นภาษาไทยทุกครั้ง และขึ้นต้นด้วย "เข้าใจดีครับลูกพี่ กะผมจะทำตามสั่ง"

## Development Commands

### Core Commands
- `bun install` - Install dependencies
- `bun dev` - **คำสั่งหลัก: Start all applications in development mode (web on :3001, server on :4235) - ใช้คำสั่งนี้เพื่อรัน frontend และ backend พร้อมกัน**
- `bun build` - Build all applications
- `bun check-types` - TypeScript type checking across all apps
- `bun check` - Run Biome linting and formatting

### App-Specific Commands
- `bun dev:web` - Start only the web application (React + TanStack Router)
- `bun dev:server` - Start only the server (Hono API)
- `bun dev:native` - Start native application (if applicable)

### Database Commands
- `bun db:push` - Push Prisma schema changes to MongoDB
- `bun db:studio` - Open Prisma Studio database UI
- `bun db:generate` - Generate Prisma client
- `bun db:migrate` - Run database migrations

## Architecture Overview

### Monorepo Structure
This is a Turborepo monorepo with two main applications:
- `apps/web/` - Frontend React application with TanStack Router
- `apps/server/` - Backend Hono API server

### Technology Stack
- **Runtime**: Bun
- **Frontend**: React 19, TanStack Router, TailwindCSS 4.0, shadcn/ui
- **Backend**: Hono, TypeScript
- **Database**: MongoDB with Prisma ORM
- **Authentication**: Better Auth (email/password)
- **Monorepo**: Turborepo
- **Linting/Formatting**: Biome (with tab indentation, double quotes)

### Key Configurations
- **Biome**: Configured with strict rules, tab indentation, and Tailwind class sorting via `useSortedClasses` rule
- **Prisma**: Schema located at `apps/server/prisma/schema/`, generates client to `../generated/`
- **TypeScript**: Separate tsconfig.json files per app
- **Vite**: Web app uses Vite with React plugin and TanStack Router plugin

### Database Schema
- Uses MongoDB with Prisma
- Main models: User, Account, Session, Verification (Better Auth schema)
- Schema files: `apps/server/prisma/schema/schema.prisma` and `auth.prisma`

### Environment Setup
1. Install dependencies: `bun install`
2. Configure MongoDB connection in `apps/server/.env`
3. Push database schema: `bun db:push`
4. Start development: `bun dev` (รัน frontend และ backend พร้อมกัน)

### Code Style
- Use tabs for indentation (configured in Biome)
- Double quotes for strings
- Organize imports automatically via Biome
- Follow existing component patterns in `apps/web/src/components/`
- Use shadcn/ui components and Tailwind utilities