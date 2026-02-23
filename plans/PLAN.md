# Plan: Next.js Cards App Setup

> **Status: ✅ Implemented** (commit `33c7bf2`)
>
> Original plan adjusted during implementation for Prisma 7, Apollo Client 4,
> and Next.js 16 compatibility. See notes marked **[adjusted]**.

## Context

Bootstrap a full-stack Next.js flashcard-learning app from an empty git repo.

**Requirements:**
- Prisma + SQLite — schema: User(role), WordSet, Word, Progress
- NextAuth v5 — roles STUDENT / TEACHER
- Apollo Server + Apollo Client
- Tailwind (via create-next-app)

---

## Step 1 — Scaffold Next.js app

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

---

## Step 2 — Install dependencies

```bash
npm install prisma @prisma/client next-auth@beta
npm install @apollo/server graphql @apollo/client
npm install @prisma/adapter-better-sqlite3 better-sqlite3 dotenv
npm install bcryptjs
npm install -D @types/bcryptjs @types/better-sqlite3
```

> **[adjusted]** `@as-integrations/next` dropped — incompatible with Next.js 16.
> `@prisma/adapter-better-sqlite3` added — required by Prisma 7 (no built-in SQLite driver).

---

## Step 3 — Prisma schema (`prisma/schema.prisma`)

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "sqlite"
  // No url here — configured in prisma.config.ts (Prisma 7)
}

enum Role { STUDENT  TEACHER }

model User {
  id        String     @id @default(cuid())
  email     String     @unique
  name      String?
  password  String
  role      Role       @default(STUDENT)
  wordSets  WordSet[]
  progress  Progress[]
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
}

model WordSet {
  id        String     @id @default(cuid())
  title     String
  teacher   User       @relation(fields: [teacherId], references: [id])
  teacherId String
  words     Word[]
  progress  Progress[]
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
}

model Word {
  id         String     @id @default(cuid())
  term       String
  definition String
  wordSet    WordSet    @relation(fields: [wordSetId], references: [id])
  wordSetId  String
  progress   Progress[]
  createdAt  DateTime   @default(now())
}

model Progress {
  id        String   @id @default(cuid())
  user      User     @relation(fields: [userId], references: [id])
  userId    String
  wordSet   WordSet  @relation(fields: [wordSetId], references: [id])
  wordSetId String
  word      Word     @relation(fields: [wordId], references: [id])
  wordId    String
  score     Int      @default(0)
  updatedAt DateTime @updatedAt

  @@unique([userId, wordId])
}
```

> **[adjusted]** Prisma 7 uses `provider = "prisma-client"` (not `prisma-client-js`),
> `output` is required, and `datasource` has no `url` field.

```bash
npx prisma migrate dev --name init
```

> DB created at `./dev.db` (project root, next to `prisma.config.ts`).

---

## Step 4 — Prisma client singleton (`src/lib/prisma.ts`)

```ts
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

function createPrismaClient() {
  const adapter = new PrismaBetterSqlite3({ url: path.resolve("./dev.db") });
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma ?? createPrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

> **[adjusted]** Prisma 7 constructor requires `adapter` — no bare `new PrismaClient()`.
> Class name: `PrismaBetterSqlite3` (not `PrismaBetterSQLite3`).

---

## Step 5 — NextAuth v5

**`src/auth.config.ts`** — edge-safe config (no Prisma import):
```ts
export const authConfig: NextAuthConfig = {
  pages: { signIn: "/login" },
  callbacks: {
    authorized({ auth, request }) { /* JWT-only check */ },
    jwt({ token, user }) { if (user) token.role = user.role; return token; },
    session({ session, token }) { session.user.role = token.role; return session; },
  },
  providers: [],
};
```

**`src/auth.ts`** — full config with Prisma:
```ts
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [Credentials({ authorize: /* bcrypt + prisma */ })],
});
```

**`src/app/api/auth/[...nextauth]/route.ts`:**
```ts
import { handlers } from "@/auth";
export const { GET, POST } = handlers;
```

**`src/types/next-auth.d.ts`** — role augmentation.

> **[adjusted]** Config split required: `auth.ts` imports Node.js modules (Prisma),
> which crash in Edge Runtime used by the proxy.

---

## Step 6 — Route protection (`src/proxy.ts`)

```ts
import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

export default NextAuth(authConfig).auth;
export const config = { matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"] };
```

> **[adjusted]** File is `proxy.ts`, not `middleware.ts` — Next.js 16 renamed the convention.

---

## Step 7 — GraphQL schema (`src/graphql/schema.ts`)

```ts
export const typeDefs = `#graphql
  enum Role { STUDENT  TEACHER }
  type User    { id: ID!  email: String!  name: String  role: Role! }
  type WordSet { id: ID!  title: String!  teacher: User!  words: [Word!]! }
  type Word    { id: ID!  term: String!  definition: String! }
  type Progress { id: ID!  wordId: ID!  wordSetId: ID!  score: Int! }

  type Query {
    wordSets: [WordSet!]!
    wordSet(id: ID!): WordSet
    myProgress(wordSetId: ID!): [Progress!]!
  }

  type Mutation {
    register(email: String!, password: String!, name: String, role: Role): User!
    createWordSet(title: String!): WordSet!          # Teacher only
    addWord(wordSetId: ID!, term: String!, definition: String!): Word!
    updateProgress(wordId: ID!, wordSetId: ID!, score: Int!): Progress!
  }
`;
```

---

## Step 8 — GraphQL resolvers (`src/graphql/resolvers.ts`)

Thin resolvers delegating to Prisma, with `requireAuth` / `requireTeacher` guards
from `context.session`.

---

## Step 9 — Apollo Server route (`src/app/api/graphql/route.ts`)

```ts
const server = new ApolloServer<GraphQLContext>({ typeDefs, resolvers });

export async function GET(req: NextRequest) { return handler(req); }
export async function POST(req: NextRequest) { return handler(req); }

async function handler(req: NextRequest) {
  await ensureStarted();            // server.start() once
  const result = await server.executeOperation(
    { query, variables, operationName },
    { contextValue: { session: await auth(), prisma } }
  );
  return NextResponse.json(result.body.singleResult);
}
```

> **[adjusted]** `@as-integrations/next` dropped; native `executeOperation` used instead.
> Export named functions (not `export { handler as GET }`) for Next.js 16 type compat.

---

## Step 10 — Apollo Client (`src/lib/apollo-client.ts`)

```ts
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
export const apolloClient = new ApolloClient({
  link: new HttpLink({ uri: "/api/graphql" }),
  cache: new InMemoryCache(),
});
```

`src/app/providers.tsx` (`"use client"`):
```ts
import { ApolloProvider } from "@apollo/client/react";   // Apollo Client 4
```

> **[adjusted]** Apollo Client 4: `ApolloProvider`, `useQuery`, `useMutation`
> moved to `@apollo/client/react`.

---

## Step 11 — Environment (`.env.local`)

```
DATABASE_URL="file:./dev.db"
AUTH_SECRET="<openssl rand -base64 32>"
NEXTAUTH_URL="http://localhost:3000"
```

---

## Step 12 — next.config.ts

```ts
const nextConfig: NextConfig = {
  turbopack: { root: __dirname },   // avoids workspace root warning
};
```

---

## Verification

1. `npm run dev` — app starts at http://localhost:3000
2. `npx prisma studio` — tables visible (User, WordSet, Word, Progress)
3. `POST /register` → user created in DB
4. `POST /login` → session with `role` field
5. `POST /api/graphql` with `{ "query": "{ wordSets { id title } }" }` → JSON response
6. Teacher: `createWordSet` + `addWord` mutations work
7. Student: `updateProgress` mutation works
8. Unauthenticated request to `/` → redirected to `/login`

---

## File tree

```
src/
  auth.config.ts          edge-safe NextAuth config
  auth.ts                 full NextAuth + Credentials + Prisma
  proxy.ts                route protection (Next.js 16)
  lib/
    prisma.ts             Prisma Client singleton (driver adapter)
    apollo-client.ts      Apollo Client singleton
  graphql/
    schema.ts             GraphQL type definitions
    resolvers.ts          resolvers with role guards
  app/
    providers.tsx         ApolloProvider ("use client")
    layout.tsx            wraps children with <Providers>
    api/
      auth/[...nextauth]/route.ts
      graphql/route.ts    Apollo Server (executeOperation)
    login/page.tsx
    register/page.tsx
  types/
    next-auth.d.ts        session role augmentation
prisma/
  schema.prisma
  migrations/
prisma.config.ts          Prisma 7 CLI config (DB URL, migrations path)
.env.local                secrets (gitignored)
dev.db                    SQLite database (gitignored)
CLAUDE.md                 project conventions for Claude Code
```
