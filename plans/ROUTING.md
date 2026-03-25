# Routing

## Protection layers

```
Request
  └─ proxy.ts (Edge, NextAuth JWT check)
       ├─ public paths → pass through
       └─ no session   → redirect /login

       (internal)/layout.tsx (Server, auth() check)
            └─ no session → redirect /login
```

`proxy.ts` matcher excludes `api/*`, `_next/static/*`, `_next/image/*`, `favicon.ico`.

---

## Route map

| URL                       | File                                  | Auth           | Render  |
| ------------------------- | ------------------------------------- | -------------- | ------- |
| `/login`                  | `app/login/page.tsx`                  | public         | client  |
| `/register`               | `app/register/page.tsx`               | public         | client  |
| `/`                       | `app/(internal)/page.tsx`             | protected      | server  |
| `/profile`                | `app/(internal)/profile/page.tsx`     | protected      | server  |
| `/api/auth/[...nextauth]` | `app/api/auth/[...nextauth]/route.ts` | —              | handler |
| `/api/graphql`            | `app/api/graphql/route.ts`            | resolver-level | handler |

---

## Route groups

### `(internal)` — authenticated pages

Shared layout: `app/(internal)/layout.tsx`

- Verifies session, redirects to `/login` if absent
- Renders `<Header>` + `<main className="max-w-5xl mx-auto px-6 py-6">`
- Pages return only their content, no wrapper

```
app/(internal)/
  layout.tsx       ← Header + main wrapper + auth guard
  page.tsx         → /           dashboard (progress stats)
  profile/
    page.tsx       → /profile    user info (name, email, role)
```

---

## Public pages

### `/login`

Client component. `signIn('credentials', { email, password })` → redirects to `/` on success. Link to `/register`.

### `/register`

Client component. Apollo `useMutation(REGISTER)` → redirects to `/login` on success. Link to `/login`.

---

## API routes

### `GET|POST /api/auth/[...nextauth]`

NextAuth handlers. Manages credential sign-in, session, and sign-out.

### `GET|POST /api/graphql`

Apollo Server via `executeOperation`. Context provides `session` (nullable) and `prisma`.
Auth enforced per-resolver with `requireAuth` / `requireTeacher` guards.

**Queries** (require auth): `wordSets`, `wordSet`, `myProgress`, `myStudents`, `myTeachers`
**Mutations** (public): `register`
**Mutations** (require auth): `createWordSet`, `addWord`, `updateProgress`
**Mutations** (require TEACHER): `addStudent`, `removeStudent`
