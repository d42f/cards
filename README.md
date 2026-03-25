# Cards — Flashcard Learning App

A flashcard-based vocabulary learning app with role-based access (Teacher / Student).

## Stack

| Layer     | Technology                                             |
| --------- | ------------------------------------------------------ |
| Framework | Next.js 16 (App Router, Turbopack)                     |
| Database  | SQLite via Prisma 7 + `@prisma/adapter-better-sqlite3` |
| Auth      | NextAuth v5 (Credentials, JWT)                         |
| API       | Apollo Server + Apollo Client 4 (GraphQL)              |
| Styles    | Tailwind CSS                                           |

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Create `.env.local`:

```
DATABASE_URL="file:./dev.db"
AUTH_SECRET="<openssl rand -base64 32>"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Database

```bash
npx prisma migrate dev --name init   # create tables
npx prisma studio                    # browse data (optional)
```

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Usage

1. `/register` — create an account as **Teacher** or **Student**
2. `/login` — sign in
3. Teacher creates a WordSet and adds Words to it
4. Student browses word sets and records Progress

## GraphQL API

Endpoint: `POST /api/graphql`

**Queries:**

```graphql
query { wordSets { id title teacher { name } words { term definition } } }
query { wordSet(id: "...") { ... } }
query { myProgress(wordSetId: "...") { wordId score } }
```

**Mutations:**

```graphql
mutation {
  register(email: "...", password: "...", role: TEACHER) {
    id
  }
}
mutation {
  createWordSet(title: "...") {
    id
  }
} # Teacher only
mutation {
  addWord(wordSetId: "...", term: "...", definition: "...") {
    id
  }
}
mutation {
  updateProgress(wordId: "...", wordSetId: "...", score: 1) {
    id
  }
}
```

## Project Structure

```
src/
  auth.config.ts          # edge-safe NextAuth config (used by proxy)
  auth.ts                 # full NextAuth config + Credentials provider
  proxy.ts                # route protection
  lib/
    prisma.ts             # Prisma Client singleton
    apollo-client.ts      # Apollo Client singleton
  graphql/
    schema.ts             # GraphQL type definitions
    resolvers.ts          # resolvers with role-based guards
  app/
    providers.tsx         # ApolloProvider wrapper
    api/auth/[...nextauth]/route.ts
    api/graphql/route.ts
  types/next-auth.d.ts    # session type augmentation
prisma/
  schema.prisma           # models: User, WordSet, Word, Progress
prisma.config.ts          # Prisma CLI configuration
```

## Commands

```bash
npm run dev              # start dev server
npm run build            # production build
npm run lint             # lint

npx prisma migrate dev --name <name>   # create and apply migration
npx prisma generate                    # regenerate Prisma client
npx prisma studio                      # database GUI
```
