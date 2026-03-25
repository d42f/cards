# Cards Project

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

- Do **not** use `@as-integrations/next` (incompatible with Next.js 16)
- Use `server.executeOperation()` directly in `src/app/api/graphql/route.ts`
- Export named `GET`/`POST` functions (not `export { handler as GET }`)

### Next.js 16

- Route protection file: `src/proxy.ts` (not `middleware.ts`)
- `turbopack.root: __dirname` in `next.config.ts` (avoids workspace root warning)

### Components

- Use **named exports** for all components (no `export default`)

### Code Quality

- **Prettier** — formatter, config in `.prettierrc` (singleQuote, printWidth: 120, trailingComma: all)
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
