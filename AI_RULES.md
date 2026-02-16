# AI Development Rules - BDSMBRAZIL

## Tech Stack
- **Framework**: React 18 with Vite for fast development and optimized builds.
- **Language**: TypeScript for type safety and better developer experience.
- **Styling**: Tailwind CSS for utility-first styling and responsive design.
- **UI Components**: shadcn/ui (Radix UI) for accessible, unstyled base components.
- **Icons**: Lucide React for a consistent and lightweight icon set.
- **Animations**: Framer Motion for smooth, high-quality transitions and interactions.
- **Routing**: React Router DOM (v6) for client-side navigation.
- **State Management**: TanStack Query (React Query) for server-state and caching.
- **Backend**: Supabase for Authentication, Database (PostgreSQL), and Storage.
- **Forms**: React Hook Form combined with Zod for schema-based validation.

## Development Guidelines

### 1. Styling & Design System
- **Theme**: Always adhere to the "Premium Dark Luxury" theme defined in `index.css`.
- **Colors**: Use custom utility classes like `text-gradient-gold`, `bg-gradient-neon`, and `glass-dark`.
- **Responsiveness**: Use Tailwind's mobile-first approach (`sm:`, `md:`, `lg:`, `xl:`).
- **Consistency**: Do not hardcode hex values; use the CSS variables defined in the `:root`.

### 2. Component Architecture
- **Atomic Design**: Keep components small, focused, and reusable.
- **Location**: Place page-level components in `src/pages/` and reusable UI elements in `src/components/`.
- **shadcn/ui**: Always check `src/components/ui/` before creating a new basic component. If it exists, use it.

### 3. Data Handling
- **Supabase**: Use the client in `src/lib/supabase.ts` for all database interactions.
- **React Query**: Wrap Supabase calls in TanStack Query hooks for loading states, error handling, and caching.
- **Types**: Always define interfaces for data structures (e.g., `Perfil`, `Service`) to maintain type safety.

### 4. Icons & Media
- **Icons**: Use `lucide-react` exclusively.
- **Images**: Use descriptive `alt` tags and consider using the `AspectRatio` component for gallery items.

### 5. Navigation
- **Links**: Use `Link` or `NavLink` from `react-router-dom` for internal navigation to avoid full page reloads.
- **Routes**: Keep all route definitions centralized in `src/App.tsx`.

### 6. Animations
- **Framer Motion**: Use `motion` components for entry animations (fade-in, slide-up) to enhance the "premium" feel.
- **Performance**: Keep animations simple and avoid animating layout properties that cause heavy reflows.