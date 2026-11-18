# Architecture Overview

## System Architecture

Care4RareDiseases is a Next.js 16 application that leverages Server Actions for direct database access, eliminating the need for intermediate API layers.

### Architecture Diagram

```
┌────────────── Browser ──────────────┐
│                                     │
│  React Components                   │
│  (UI Layer)                         │
│                                     │
└──────────────┬──────────────────────┘
               │
               ▼
┌──────────── Redux Store ────────────┐
│                                     │
│  State Management (Client)          │
│  - authSlice                        │
│  - patients Slice                    │
│  - databaseSlice                    │
│  - reportsSlice                     │
│                                     │
└──────────────┬──────────────────────┘
               │
               ▼
┌──────── Server Actions ─────────────┐
│                                     │
│  'use server' Functions             │
│  (RPC Layer)                        │
│  - auth.ts                          │
│  - patients.ts                      │
│  - database.ts                      │
│  - reports.ts                       │
│                                     │
└──────────────┬──────────────────────┘
               │
               ▼
┌────────── Drizzle ORM ──────────────┐
│                                     │
│  Type-safe Database Access          │
│  - Schema definitions               │
│  - Query builders                   │
│                                     │
└──────────────┬──────────────────────┘
               │
               ▼
┌──────────── SQLite ─────────────────┐
│                                     │
│  Local Database                     │
│  - care4rare.db                     │
│                                     │
└─────────────────────────────────────┘
```

## Key Design Decisions

### 1. Server Actions over API Routes

**Why**: Since SQLite is a local database, using API routes adds unnecessary network overhead. Server Actions provide:

- **Zero network latency** - Direct function calls instead of HTTP requests
- **Better performance** - No serialization/deserialization overhead
- **Type safety** - End-to-end TypeScript support
- **Smaller bundle** - No API route code shipped to client
- **Simpler architecture** - Fewer layers to maintain

**Before (API Routes)**:
```
Component → fetch('/api/patients') → API Route → Drizzle → SQLite
```

**After (Server Actions)**:
```
Component → getPatientsAction() → Drizzle → SQLite
```

### 2. SQLite as the Database

**Advantages**:
- Zero configuration
- Embedded database (no separate server)
- ACID compliance
- Perfect for local development
- Easy to backup (single file)

**Limitations**:
- Not suitable for high concurrency
- Not cloud-native
- Single writer at a time

**Migration Path**: When scaling is needed, Drizzle ORM makes it easy to migrate to PostgreSQL or MySQL without changing application code.

### 3. Redux Toolkit for State Management

While Server Actions are async, Redux provides:
- Global state management
- Predictable state updates
- DevTools for debugging
- Middleware support
- Caching layer

**State Slices**:
- `authSlice` - User authentication state
- `patientSlice` - Patient data cache
- `databaseSlice` - Database view state
- `reportsSlice` - Reports management
- `uiSlice` - UI preferences and toggles

## Data Flow

### Authentication Flow

```
1. User enters credentials on Login Page
2. Component dispatches login() thunk
3. Thunk calls loginAction() Server Action
4. Server Action:
   - Queries users table via Drizzle
   - Checks the login throttle (per account and per IP)
   - Validates password with bcrypt (a dummy hash is compared for unknown emails, so timing does not reveal accounts)
   - Generates a random 256-bit token; stores only its SHA-256 hash in `sessions`
   - Sets the httpOnly, SameSite=Strict cookie and writes an audit event
5. Returns user data to Redux
6. Redux updates auth state
7. Component redirects to dashboard
```

### Data Fetching Flow

```
1. Component mounts (e.g., Database View)
2. useEffect() dispatches fetchAllPatients()
3. Thunk calls getAllPatientsAction() Server Action
4. Server Action:
   - Resolves the user from the session (requireUser) — expired/idle sessions are deleted
   - Computes the user's patient scope (admin: all; clinician: assigned; others: none)
   - Queries only in-scope rows via Drizzle
   - Returns patient data (single-patient reads are audited)
5. Redux stores patients in state
6. Component renders from state
```

## Database Schema

### Core Entities

1. **users** - Accounts and roles (admin, clinician, researcher, user)
2. **sessions** - Active sessions (hashed opaque tokens, absolute + idle expiry)
3. **patients** - Patient clinical records with genetic data
4. **reports** - Generated patient reports
5. **doctor_patient_assignments** - Clinician ↔ patient access (FK to users)
6. **audit_events** - Append-only security and PHI-access log

Migrations live in `drizzle/` and are applied in order by `yarn db:apply` (`scripts/migrate.ts`), tracked in `__drizzle_migrations`.

### Schema Features

- **JSON columns** for complex data (phenotypes, variant info, knowledge graphs)
- **Foreign keys** for referential integrity
- **Timestamps** for audit trails
- **Unique constraints** on critical fields

## Security Architecture

Code lives in `src/lib/auth/` (all `server-only`) and `src/lib/audit.ts`.

### Authentication

1. **Password hashing**: bcrypt (cost 12 for new hashes)
2. **Sessions**: random 256-bit token in the cookie; only its SHA-256 hash is stored, so a database leak does not expose live sessions. Server-side revocation on logout, password change and "sign out everywhere".
3. **Expiry**: 30-minute idle timeout, 8-hour absolute lifetime
4. **Cookies**: httpOnly, SameSite=Strict, Secure + `__Host-` prefix in production
5. **Throttling**: 5 failures per account → 15-minute lockout; 30 attempts per IP per 15 minutes (in-memory)

### Authorization

- `requireUser()` / `requireRole()` at the top of every Server Action
- `requirePatientAccess(patientId)` for every patient-scoped read, write and AI request; denials are audited and reported to the client as "not found"
- List queries are filtered by the caller's patient scope in `src/lib/data/scoped.ts`
- Inputs validated with zod; Drizzle parameterises all SQL

### Defence in depth

- `src/proxy.ts`: redirects signed-out users from app pages (optimistic cookie check only — the actions are the real gate) and sets a per-request nonce CSP with `strict-dynamic`
- `next.config.ts`: HSTS (production), `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy: no-referrer`, `Permissions-Policy`, COOP/CORP; `X-Powered-By` disabled
- AI prompts: patient data is loaded server-side (never accepted from the client) and wrapped in `<patient_data>` under a system instruction that forbids following embedded instructions

## Performance Optimizations

### Server Actions

- Direct database queries (no HTTP overhead)
- Automatic code splitting
- Server-only code (no client bundle bloat)

### Database

- Indexed primary keys
- Foreign key indexes
- JSON columns for complex data (avoid multiple tables)
- Query optimization with Drizzle select projections

### Frontend

- Redux state caching
- Lazy component loading
- Optimized React re-renders
- Tailwind CSS purging

## Deployment Considerations

### Development

```bash
yarn dev  # Next.js development server with hot reload
```

### Production

```bash
yarn build  # Build optimized production bundle
yarn start  #Start production server
```

### Environment Variables

- `GEMINI_API_KEY`: server-side only
- `DATABASE_PATH` (optional)
- `NODE_ENV`: 'development' or 'production'

### Database

- SQLite file: `data/care4rare.db`
- Backup strategy: Copy database file
- Migrations: `yarn db:generate` then `yarn db:apply`
- Contains PHI: keep out of git, encrypt backups

## Scaling Considerations

### Current Limitations

- Single SQLite file (not distributed)
- Limited concurrency
- Not suitable for multi-tenant
- Login throttle is per-process memory; use a shared store before running several instances

### Migration Path

1. **To PostgreSQL**: Update `drizzle.config.ts` and connection string
2. **To Cloud**: Deploy to Vercel/Railway with managed PostgreSQL
3. **API Layer**: If needed for mobile apps, add Next.js API routes as facade

## Technology Choices

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16 | React framework with Server Actions |
| Drizzle ORM | Latest | Type-safe database access |
| SQLite | 3 | Embedded database |
| Redux Toolkit | Latest | State management |
| Tailwind CSS | v4 | Utility-first styling |
| shadcn/ui | Latest | Component library |
| bcryptjs | Latest | Password hashing |
| zod | Latest | Server Action input validation |

## File Organization

```
src/
├── app/              # Next.js App Router (pages)
├── components/       # React components
└── lib/
    ├── actions/      # Server Actions (RPC layer)
    ├── db/           # Database schema & seeds
    └── store/        # Redux store & slices
```

### Conventions

- Server Actions: `'use server'` directive, `*Action` suffix
- Redux slices: `*Slice.ts` naming
- Components: PascalCase naming
- Utilities: camelCase naming

## Testing Strategy

### Unit Tests

- Server Actions with mock database
- Redux reducers
- Utility functions

### Integration Tests

- Authentication flow
- Data persistence
- Session management

### E2E Tests

- Login/logout flows
- Patient management workflows
- Report generation

## Monitoring & Debugging

### Tools

- **Redux DevTools**: State inspection
- **Drizzle Studio**: Database GUI (`yarn db:studio`)
- **Next.js DevTools**: Performance profiling
- **Console Logs**: Server Action debugging

## Future Enhancements

1. **Real-time Updates**: WebSockets for collaborative editing
2. **File Uploads**: Genomic data file storage
3. **Advanced Search**: Full-text search with SQLite FTS
4. **Data Visualization**: Enhanced knowledge graph interactions
5. **Export Features**: PDF report generation
6. **API Layer**: REST API for mobile apps
7. **Multi-tenancy**: Organization-based data isolation

## References

- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
