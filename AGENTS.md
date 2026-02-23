# AGENTS.md - Rehoming Center Project

This document provides guidance for AI coding agents working in this repository.

## Project Overview

A Next.js 16 application for a Korean pet adoption center (rehoming center). Features a premium UI with Framer Motion animations, Apollo Client for GraphQL data fetching, and Tailwind CSS 4 for styling.

## Build/Lint/Test Commands

```bash
# Development
npm run dev          # Start dev server at localhost:3000

# Production
npm run build        # Build for production
npm run start        # Start production server

# Linting
npm run lint         # Run ESLint on entire project
npm run lint -- --fix  # Auto-fix lint issues

# Single File Lint
npx eslint src/app/page.tsx

# Type Checking
npx tsc --noEmit     # Run TypeScript type check without emitting
```

**Note**: No test framework is currently configured.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **React**: 19.2.3
- **Styling**: Tailwind CSS 4 with custom theme
- **TypeScript**: Strict mode enabled
- **Data Fetching**: Apollo Client + GraphQL
- **Animation**: Framer Motion
- **Font**: Pretendard Variable (Korean-optimized)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout (Header + Footer)
│   ├── page.tsx            # Home page
│   ├── globals.css         # Tailwind + custom theme
│   └── [route]/page.tsx    # Route pages (about, adopt, etc.)
├── components/
│   ├── layout/             # Layout components (Header, Footer)
│   └── common/             # Shared components (ChannelTalk)
```

## Code Style Guidelines

### Imports

```tsx
"use client";  // Must be first line if client component

// 1. External imports (React, Next.js, libraries)
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

// 2. Internal imports with @/ alias
import Header from "@/components/layout/Header";
```

- Use `@/` alias for internal imports (maps to `./src/*`)
- Place `"use client"` directive at the very top when needed
- Import types separately: `import type { Metadata } from "next";`

### Components

```tsx
// Default export pattern
export default function ComponentName() {
  return (
    // JSX
  );
}

// With props - use Readonly and explicit typing
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // ...
}
```

- Use `export default function` for all components
- Component names: PascalCase (Header, Footer, ChannelTalk)
- File names: PascalCase for components (Header.tsx)
- Use `Readonly<>` wrapper for immutable props

### TypeScript

- Strict mode is enabled - no `any` types without justification
- Use `type` keyword for type definitions
- Inline types for simple props, separate types for complex ones
- Global declarations in component files when needed:

```tsx
declare global {
  interface Window {
    ChannelIO?: any;
  }
}
```

### Styling (Tailwind CSS 4)

Custom theme colors defined in `globals.css`:

```css
--color-brand-trust: #002EDB;   /* Primary blue */
--color-brand-warmth: #F59E0B;  /* Accent amber/orange */
```

Usage patterns:

```tsx
// Use custom colors
className="text-brand-trust bg-brand-warmth"

// Multi-line className with ternary
className={`base-classes ${condition
  ? "true-classes"
  : "false-classes"
}`}
```

- Utility-first approach - avoid custom CSS unless necessary
- Use responsive prefixes: `md:`, `lg:`, `sm:`
- Use `group` and `group-hover:` for hover effects on children

### Formatting

- Double quotes for strings
- No semicolons (project convention is inconsistent, prefer omitting)
- Template literals for dynamic class strings
- Multi-line ternary expressions inside template literals
- 2-space indentation

### React Patterns

```tsx
// State initialization
const [scrolled, setScrolled] = useState(false);

// Effects with cleanup
useEffect(() => {
  const handler = () => {};
  window.addEventListener("scroll", handler);
  return () => window.removeEventListener("scroll", handler);
}, []);

// Early returns for guards
if (typeof window === "undefined") return;
```

- Use functional updates when state depends on previous state
- Clean up event listeners and subscriptions in useEffect return
- Use early returns for SSR guards and validation

### Error Handling

- Use early returns instead of deeply nested conditionals
- Optional chaining (`?.`) for potentially undefined values
- Return `null` for components that shouldn't render

### Framer Motion

```tsx
import { motion } from "framer-motion";

<motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, delay: 0.1 }}
  whileHover={{ y: -10 }}
>
```

- Use `motion` components for animated elements
- `whileInView` for scroll-triggered animations with `viewport: { once: true }`
- Keep animation values consistent with existing patterns

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `Header`, `ChannelTalk` |
| Functions | camelCase | `handleScroll` |
| Variables | camelCase | `navigation`, `isActive` |
| Constants | camelCase | `pluginKey` |
| CSS custom properties | kebab-case | `--color-brand-trust` |

## Files to Avoid Editing

- `.next/` - Build output
- `node_modules/` - Dependencies
- `next-env.d.ts` - Auto-generated TypeScript declarations

## Environment Variables

- `NEXT_PUBLIC_CHANNEL_TALK_PLUGIN_KEY` - ChannelTalk integration

## Korean Content

This is a Korean-language application. When adding content:
- Use Korean text for user-facing content
- Maintain Korean navigation labels
- Preserve existing Korean copy style (polite, warm tone)
