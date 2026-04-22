# Cards Project

## Maintaining This File

This file is shared context between sessions — the only persistent project knowledge a new conversation starts with.

**Add:**

- Architectural decisions with reasoning: what was chosen, why, what alternatives were considered and rejected. A decision without "why" is dead: a month later it's unclear whether it can be revisited.
- What cannot be broken and why (auth invariants, data model constraints, external contracts).

**Don't add:**

- Code retelling, folder structure, file names, function names — readable from the repo.
- Current progress, TODOs, or session-specific notes — use the in-chat plan for that.
- Decisions without reasoning.

**Update regularly:** after any architectural decision, convention change, or non-obvious gotcha discovered during work — update this file before closing the task. A stale CLAUDE.md is worse than none: it misleads instead of helping.

**Update carefully:** when a decision changes, edit the existing entry — don't create a second one. Delete outdated entries immediately; don't mark them "outdated".

---

## Stack

- **Next.js 16** (App Router, Turbopack, `src/` dir, TypeScript)
- **Prisma 7** + SQLite via `@prisma/adapter-better-sqlite3`
- **NextAuth v5** (beta) — Credentials provider, STUDENT/TEACHER roles
- **Apollo Server** (native route handler) + **Apollo Client 4**
- **Tailwind CSS**

## Key Conventions

### Prisma 7

- Schema datasource has **no `url`** — connection config lives in `prisma.config.ts`
- Generator: `provider = "prisma-client"`, output → `src/generated/prisma/`
- Import: `import { PrismaClient } from "@/generated/prisma/client"`
- Adapter: `new PrismaBetterSqlite3({ url: dbPath })` (note: `Sqlite3`, not `SQLite3`)
- Singleton in `src/lib/prisma.ts`
- After schema changes: `npx prisma migrate dev --name <name>`

### NextAuth v5

- Config is split into two files because `proxy.ts` runs on the Edge runtime, which cannot import Node.js modules (Prisma). Edge-safe parts go in `auth.config.ts`; full Node.js config (Credentials + Prisma) goes in `auth.ts`.
- `src/auth.config.ts` — edge-safe config (no Prisma), used by proxy
- `src/auth.ts` — full config with Credentials provider + Prisma
- `src/proxy.ts` — route protection (`NextAuth(authConfig).auth`)
- Session includes `user.role` (augmented in `src/types/next-auth.d.ts`)

### Apollo Client 4

- React hooks from `@apollo/client/react` (not `@apollo/client`)
- `ApolloProvider` from `@apollo/client/react`
- `ApolloClient`, `InMemoryCache`, `HttpLink`, `gql` from `@apollo/client`
- Client singleton in `src/lib/apollo-client.ts`
- Provider wrapped in `src/app/providers.tsx` (`"use client"`)

### Apollo Server

- `@as-integrations/next` produces a type conflict with Next.js 16 App Router route handler signatures — it cannot be used. The only working approach is calling `server.executeOperation()` directly inside a manually written `GET`/`POST` handler.
- Do **not** use `@as-integrations/next` (type conflict with Next.js 16 App Router)
- Use `server.executeOperation()` directly in `src/app/api/graphql/route.ts`
- Export named `GET`/`POST` functions (not `export { handler as GET }`)

### Next.js 16

- Next.js 16 renamed the middleware entry point from `middleware.ts` to `proxy.ts` for route protection — do not revert to `middleware.ts`.
- Route protection file: `src/proxy.ts` (not `middleware.ts`)
- `turbopack.root: __dirname` in `next.config.ts` (avoids workspace root warning when parent dirs also have `package-lock.json`)

### Components

- Use **named exports** for all components (no `export default`) — avoids ambiguous re-exports in barrel files and makes renames refactor-safe

### Dialogs

- Library: **`@radix-ui/react-dialog`** — `Root`, `Portal`, `Overlay`, `Content`, `Title`, `Close`
- Shared wrapper: `src/shared/components/Dialog.tsx` — accepts `open`, `onClose`, `title`, `children`, `className`, `dismissible` (default `true`; when `false`, clicking outside and pressing Escape do not close the dialog)
- Shared close button: `src/shared/components/CloseButton.tsx` — wrapper around `Button` with a ✕ icon
- Generic hook: `src/shared/hooks/useDialog.ts` — returns `{ show, hide, render }`:
  - `show()` / `hide()` — open/close
  - `render(props)` — renders `<Dialog>` with current `open` and `onClose: hide`
- Entity dialog pattern: create a `useXxxDialog()` hook in the entity file that uses `useDialog` internally and returns `{ show, render }`:

```tsx
// src/entities/MyDialog.tsx
function MyDialogContent({ onClose }) { ... }

export function useMyDialog() {
  const { show, hide, render } = useDialog();
  return {
    show,
    render: () => render({ title: '...', children: <MyDialogContent onClose={hide} /> }),
  };
}

// Usage
const { show, render } = useMyDialog();
<Button onClick={show}>Open</Button>
{render()}
```

### Colors

Tailwind v4 — tokens defined in `apps/web/src/app/globals.css` via `@theme inline`.

**Neutral scale** (backgrounds → text, light to dark):

| Token            | Hex       | Usage                 |
| ---------------- | --------- | --------------------- |
| `neutral-bright` | `#FAF9F5` | page background       |
| `neutral-light`  | `#F4F4F0` | cards, panels         |
| `neutral-mid`    | `#EEEEE8` | nested sections       |
| `neutral-dark`   | `#E5E4DE` | inputs, inset areas   |
| `neutral-deep`   | `#C2C8BE` | borders, dividers     |
| `neutral-black`  | `#737970` | subtle text, metadata |
| `neutral-coal`   | `#424841` | secondary text        |
| `neutral`        | `#1A1C1A` | primary text          |

**Accent colors** (all named by color, not role):

| Token          | Hex       | Notes                                          |
| -------------- | --------- | ---------------------------------------------- |
| `sage`         | `#5F7C55` | primary action — buttons, progress, active nav |
| `sage-light`   | `#E3E6DD` | sage at 15% opacity on bright                  |
| `sage-bright`  | `#EEEFE8` | sage at 8% opacity on bright                   |
| `terra`        | `#79542E` | labels only — never on buttons                 |
| `terra-light`  | `#E7E0D7` | terra at 15% opacity on bright                 |
| `terra-bright` | `#F1EDE7` | terra at 7% opacity on bright                  |
| `steel`        | `#48626E` | secondary links, Hard difficulty               |
| `steel-light`  | `#DFE2E1` | steel at 15% opacity on bright                 |
| `red`          | `#BA1A1A` | errors, destructive actions                    |
| `red-light`    | `#F4E3DF` | red at 10% opacity on bright                   |

**Usage:**

```html
<div class="bg-neutral-light border border-neutral-deep">
  <h2 class="text-neutral">Title</h2>
  <p class="text-neutral-coal">Body text</p>
  <span class="text-neutral-black">Metadata</span>
  <button class="bg-sage text-white">Action</button>
  <span class="bg-red-light text-red">Error</span>
</div>
```

- All tokens work with any Tailwind utility prefix: `bg-`, `text-`, `border-`, `ring-`
- Never use raw hex values — always use tokens
- Only one `sage` action element per screen

### Code Quality

- **Prettier** — formatter, config in `.prettierrc` (singleQuote, printWidth: 120, trailingComma: all); `prettier-plugin-tailwindcss` sorts Tailwind classes automatically
- **ESLint** — flat config `eslint.config.mjs`, `eslint-config-prettier` disables conflicting rules
- **Husky + lint-staged** — pre-commit hook runs ESLint + Prettier on staged files
- **Commitlint** — enforces [Conventional Commits](https://www.conventionalcommits.org/) via commit-msg hook
  - Format: `type(scope): description` — types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `style`

## Commands

```bash
npm run dev          # start dev server
npm run build        # production build
npm run lint         # ESLint check
npm run format       # Prettier — format all files
npm run format:check # Prettier — check without writing
npx prisma migrate dev --name <name>   # create + apply migration
npx prisma generate  # regenerate client after schema change
npx prisma studio    # DB browser GUI
```

## Environment

Copy `.env.local` and set:

```
DATABASE_URL="file:./dev.db"
AUTH_SECRET="<openssl rand -base64 32>"
NEXTAUTH_URL="http://localhost:3000"
```

## Plans & Reference Docs

| File                                 | Description                                                                                                                                                                                 |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [plans/SETUP.md](plans/SETUP.md)     | Initial project setup: step-by-step bootstrap of Prisma 7, NextAuth v5, Apollo Server/Client, and Next.js 16. Status: ✅ implemented. Contains adjusted notes for version-specific gotchas. |
| [plans/ROUTING.md](plans/ROUTING.md) | Route map, protection layers (`proxy.ts` → layout auth guard), route groups, and GraphQL auth matrix.                                                                                       |
