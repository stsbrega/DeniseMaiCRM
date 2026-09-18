# Claude Project Guidelines - Denise Mai Lofty CRM

## Project Overview
Custom Real Estate Automation CRM designed to synchronize with Lofty API and provide a "Single Pane of Glass" experience for lead management, communication, and document handling.

## Tech Stack
- **Framework:** Next.js (App Router, src directory)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Backend/BaaS:** Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **Deployment:** Vercel (Frontend), Supabase Cloud (Backend)

## Coding Standards
- **Components:** Use functional components with TypeScript interfaces for props.
- **Styling:** Utility-first approach using Tailwind CSS. Avoid custom CSS files unless necessary.
- **State Management:** 
  - Use Supabase for server-side state and data persistence.
  - Use React hooks (`useState`, `useReducer`, `useContext`) for local UI state.
- **API Interaction:** 
  - Implement a service layer in `src/services/` for all external API calls (Lofty, Supabase).
  - Use `src/lib/` for shared configurations and utility functions.
- **Type Safety:** Define all domain entities (Lead, User, Task, etc.) in `src/types/`. Avoid `any`.

## Naming Conventions
- **Files/Folders:** `kebab-case` (e.g., `lead-detail-view.tsx`, `auth-provider.tsx`).
- **Components:** `PascalCase` (e.g., `LeadCard`, `Navbar`).
- **Functions/Variables:** `camelCase` (e.g., `getLeadById`, `isLeadActive`).
- **Constants:** `UPPER_SNAKE_CASE` (e.g., `API_BASE_URL`).

## Project Structure
- `src/app/`: Next.js App Router pages and layouts.
- `src/components/`: Reusable UI components.
- `src/lib/`: Third-party library configurations (e.g., `supabaseClient.ts`).
- `src/hooks/`: Custom React hooks.
- `src/types/`: TypeScript type definitions.
- `src/services/`: Business logic and API wrappers.
- `src/utils/`: Pure utility functions.

## Git Guidelines
- Use descriptive commit messages following the pattern: `feat: ...`, `fix: ...`, `refactor: ...`, `docs: ...`.
- End commits with the required attribution.
