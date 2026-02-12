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
   - Validates password with bcrypt
   - Creates JWT token
   - Stores session in database
   - Sets httpOnly cookie
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
   - Verifies authentication via getSessionAction()
   - Queries patients table via Drizzle
   - Returns patient data
5. Redux stores patients in state
6. Component renders from state
```

## Database Schema

### Core Entities

1. **users** -Authentication & authorization
2. **doctors** - Legacy doctor accounts (backward compatibility)
3. **sessions** - Active user sessions (JWT tokens)
4. **patients** - Patient clinical records with genetic data
5. **reports** - Generated patient reports
6. **doctor_patient_assignments** - Many-to-many relationship

### Schema Features

- **JSON columns** for complex data (phenotypes, variant info, knowledge graphs)
- **Foreign keys** for referential integrity
- **Timestamps** for audit trails
- **Unique constraints** on critical fields

## Security Architecture

### Authentication

1. **Password Hashing**: bcrypt with automatic salt
2. **JWT Tokens**: Signed with HS256, 7-day expiration
3. **httpOnly Cookies**: Prevents XSS attacks
4. **Secure Cookies**: HTTPS-only in production
5. **Session Validation**: Every Server Action checks session

### Authorization

- Role-based access control (RBAC)
- Server-side token verification
- Session expiration checks
- SQL injection prevention (Drizzle parameterized queries)

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

- `JWT_SECRET`: Strong random string (min  32 chars)
- `NODE_ENV`: 'development' or 'production'

### Database

- SQLite file: `data/care4rare.db`
- Backup strategy: Copy database file
- Migrations: Use `yarn db:generate` and `yarn db:push`

## Scaling Considerations

### Current Limitations

- Single SQLite file (not distributed)
- Limited concurrency
- Not suitable for multi-tenant

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
| bcrypt | Latest | Password hashing |
| jose | Latest | JWT token handling |

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
