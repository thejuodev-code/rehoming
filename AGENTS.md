# AGENTS.md - Rehoming Center

**Updated:** 2026-02-24 | **Commit:** 92ad146 | **Branch:** main

Korean pet adoption center (입양 센터) built with Next.js 14 App Router.

---

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 14.2.23 (App Router) |
| React | 18.3.1 |
| Styling | Tailwind CSS 4 (`@theme` in globals.css) |
| Data | Apollo Client 4 → WordPress GraphQL |
| Animation | Framer Motion |
| Font | Pretendard Variable (Korean) |
| TypeScript | Strict mode |

---

## Commands

```bash
npm run dev                 # localhost:3000
npm run build               # Production build
npm run lint                # ESLint
npm run lint -- --fix       # Auto-fix
npx tsc --noEmit            # Type check
```

**No test framework configured.**

---

## Structure

```
src/
├── app/                    # Routes: /, /about, /adopt, /activities/[slug], /donate, /impact, /process, /reviews
│   ├── layout.tsx          # Root layout (Header/Footer/Providers)
│   ├── page.tsx            # Home (539 lines - largest file)
│   └── globals.css         # Tailwind @theme: brand-trust, brand-warmth
├── components/
│   ├── common/             # Providers, ChannelTalk, ImagePlaceholder
│   ├── layout/             # Header, Footer
│   └── about/              # AboutTabs, KakaoMapLocation
├── lib/
│   ├── apollo-client.ts    # Apollo config (NEXT_PUBLIC_WORDPRESS_API_URL)
│   └── queries.ts          # GraphQL: GET_POSTS, GET_ACTIVITIES, GET_ACTIVITY_BY_SLUG
└── types/
    └── graphql.ts          # WordPressPost, ActivityPost, GetPostsData, etc.
```

---

## Where to Look

| Task | File(s) |
|------|--------|
| Add page | `src/app/[route]/page.tsx` |
| Edit navigation | `src/components/layout/Header.tsx` (navigation array) |
| Add GraphQL query | `src/lib/queries.ts` + type in `src/types/graphql.ts` |
| Change brand colors | `src/app/globals.css` → `@theme` block |
| Modify Apollo config | `src/lib/apollo-client.ts` |
| Add global provider | `src/components/common/Providers.tsx` + import in `layout.tsx` |
| Edit home page | `src/app/page.tsx` (539 lines - consider splitting if adding more) |

---

## Code Style

### Imports (strict order)
```tsx
"use client";  // First line if client component

// 1. React/Next
import { useState } from "react";
import { useQuery } from '@apollo/client/react';
import { motion } from "framer-motion";
import Link from "next/link";

// 2. @/ alias
import Header from "@/components/layout/Header";
import { GET_POSTS } from '@/lib/queries';
```

### Components
```tsx
// Server (default)
export default function Page() { return <div />; }

// Client
'use client';
export default function Widget({ title }: { title: string }) { return <div>{title}</div>; }
```

- Always `export default function`
- Inline prop types: `{ prop: Type }`

### Tailwind
```tsx
// Brand colors from @theme
className="text-brand-trust bg-brand-warmth"

// Korean text
className="break-keep"  // Prevents awkward line breaks
```

### Framer Motion
```tsx
const fadeInUp = {
  hidden: { opacity: 0, y: 60, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }
};

<motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
```

### GraphQL
```tsx
import { useQuery } from '@apollo/client/react';  // NOT '@apollo/client'

const { data, loading } = useQuery<GetPostsData>(GET_POSTS);
{loading ? <Skeleton /> : data?.posts?.nodes?.map(...)}
```

---

## Anti-Patterns

| Pattern | Location | Fix |
|---------|----------|-----|
| `fadeInUp as any` | `src/app/page.tsx:148,157,163,378,516` | Type as `Variants` from framer-motion |
| `post: any` in loops | `src/app/page.tsx:373,375` | Use `WordPressPost` type |
| `ch: any` | `src/components/common/ChannelTalk.tsx:24` | Type ChannelIO stub properly |

---

## Conventions (from .cursorrules)

1. **Think first** - State assumptions. Ask if unclear. Present alternatives.
2. **Minimal code** - No speculative features. No abstractions for single-use.
3. **Surgical edits** - Touch only requested code. Match existing style.
4. **Verify** - Define success criteria. Check before marking done.

---

## Environment

| Variable | Purpose |
|----------|--------|
| `NEXT_PUBLIC_WORDPRESS_API_URL` | GraphQL endpoint |
| `NEXT_PUBLIC_CHANNEL_TALK_PLUGIN_KEY` | Chat widget |

---

## Notes

- **Large files**: `src/app/page.tsx` (539 lines), `src/app/activities/page.tsx` (434 lines) - split if growing
- **No CI/CD**: No `.github/workflows` or tests - add if needed
- **No Prettier/EditorConfig**: Formatting via ESLint only
- **Dual next.config**: Both `.mjs` and `.ts` exist (both empty) - pick one
