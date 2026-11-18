# Care4RareDiseases

A Next.js application for managing rare disease patient data with AI-powered analysis and knowledge graph visualization.

## 🚀 Tech Stack

- **Framework**: Next.js 16 with App Router (Server Actions)
- **Database**: SQLite with Drizzle ORM
- **State Management**: Redux Toolkit
- **Authentication**: Database-backed sessions (opaque token, SHA-256 hashed at rest) in httpOnly cookies
- **Styling**: Tailwind CSS + shadcn/ui components
- **Package Manager**: yarn
- **Password Hashing**: bcryptjs
- **TypeScript**: Full type safety

## 📋 Features

- **User Authentication**: Role-based access control (Admin, Clinician, Researcher, User)
- **Patient Management**: Comprehensive patient records with genomic data
- **Knowledge Graphs**: Visual representation of disease-gene-phenotype relationships
- **Reports**: Generate and manage patient reports
- **Database Management**: Full CRUD operations with Drizzle ORM
- **Responsive Design**: Mobile-friendly interface

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 20.9+ (Next.js 16 requirement)
- yarn (recommended) or npm

### 1. Clone and Install

```bash
# Clone the repository
cd Care4RareDiseases

# Install dependencies
yarn install
```

> **Note**: If you encounter permission errors with `node_modules`, run:
> ```bash
> sudo chown -R $(whoami) /Users/musahibrahimali/Dev/typescript/Care4RareDiseases
> ```

### 2. Environment Variables

```bash
cp .env.example .env.local
```

| Variable | Required | Purpose |
|----------|----------|---------|
| `GEMINI_API_KEY` | For AI features | Google Gemini key, used server-side only |
| `DATABASE_PATH` | No | SQLite file (default `./data/care4rare.db`) |
| `SEED_ADMIN_PASSWORD`, `SEED_CLINICIAN_PASSWORD` | No | Initial passwords for `yarn db:seed`; random ones are generated and printed if unset |

There is no signing secret to manage: sessions are random tokens looked up in the database.

### 3. Database Setup

```bash
yarn db:apply   # apply all pending migrations in ./drizzle (safe to re-run)
yarn db:seed    # create the initial admin and clinician accounts
```

`data/` is git-ignored: patient data must never be committed.

### 4. Start Development Server

```bash
yarn dev
```

The application will be available at **http://localhost:3000**

## 🔐 Initial Accounts

`yarn db:seed` creates one admin and three clinician accounts. Passwords come from
`SEED_ADMIN_PASSWORD` / `SEED_CLINICIAN_PASSWORD`, or are randomly generated and printed once.

Reset any account's password (also signs it out everywhere):

```bash
yarn user:set-password admin@care4rare.com
```

## 📁 Project Structure

```
Care4RareDiseases/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (protected)/         # Protected routes (require auth)
│   │   │   ├── dashboard/       # Main dashboard
│   │   │   ├── patients/        # Patient management
│   │   │   ├── reports/         # Report generation
│   │   │   ├── database/        # Database viewer
│   │   │   ├── settings/        # User settings
│   │   │   ├── help/            # Help documentation
│   │   │   └── layout.tsx       # Protected layout with auth
│   │   ├── api/                 # API routes
│   │   │   ├── auth/           # Authentication endpoints
│   │   │   │   ├── login/
│   │   │   │   ├── logout/
│   │   │   │   └── session/
│   │   │   └── patients/       # Patient API
│   │   ├── login/              # Login page
│   │   ├── layout.tsx          # Root layout with Redux
│   │   ├── page.tsx            # Home page
│   │   └── globals.css         # Global styles
│   ├── components/             # React components
│   │   ├── ui/                 # shadcn/ui components
│   │   └── ...                 # Application components
│   └── lib/                    # Utilities and configuration
│       ├── db/                 # Database layer
│       │   ├── index.ts        # Database connection
│       │   ├── schema.ts       # Drizzle schema & types
│       │   └── seed-drizzle.ts # Seed script
│       ├── data/               # Static data
│       │   ├── patientData.ts  # Patient clinical data
│       │   ├── reportsData.ts  # Report data
│       │   └── databaseData.ts # Patient status data
│       └── store/              # Redux store
│           ├── index.ts        # Store configuration
│           ├── hooks.ts        # Typed hooks
│           └── slices/         # Redux slices
├── scripts/                    # Utility scripts
│   ├── migrate.js             # Database migration
│   └── seed.js                # Database seeding
├── data/                      # SQLite database storage
│   └── care4rare.db          # SQLite database file
├── drizzle.config.ts         # Drizzle configuration
├── next.config.ts            # Next.js configuration
├── tailwind.config.ts        # Tailwind configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies and scripts
```

## 🗄️ Database Schema

### users
User authentication and authorization

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key (auto-increment) |
| email | TEXT | Unique email address |
| passwordHash | TEXT | Bcrypt hashed password |
| name | TEXT | User's full name |
| role | TEXT | Role: 'admin', 'clinician', 'researcher', 'user' |
| isActive | BOOLEAN | Account status (default: true) |
| createdAt | TIMESTAMP | Account creation time |
| updatedAt | TIMESTAMP | Last update time |

### patients
Patient clinical records

| Column | Type | Description |
|--------|------|-------------|
| id | TEXT | Patient ID (e.g., 'UDN-P4') |
| age | INTEGER | Patient age |
| sex | TEXT | 'male', 'female', or 'other' |
| genomicFile | TEXT | Genomic data file reference |
| clinicalNotes | TEXT | Clinical observations |
| phenotypes | JSON | Array of phenotype descriptions |
| variantInfo | JSON | Genetic variant information |
| knowledgeGraph | JSON | Disease-gene-phenotype graph data |
| status | TEXT | 'Pending Analysis', 'Results Ready', 'Reviewed' |
| lastUpdated | TIMESTAMP | Last update time |
| assignedClinician | TEXT | Assigned clinician name |

### reports
Patient reports

| Column | Type | Description |
|--------|------|-------------|
| id | TEXT | Report ID (e.g., 'RPT-2025-001') |
| patientId | TEXT | Foreign key to patients |
| patientName | TEXT | Patient name |
| dateGenerated | TEXT | Report generation date |
| generatedBy | TEXT | Clinician who generated report |

### sessions

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| user_id | INTEGER | Foreign key to users |
| token_hash | TEXT | SHA-256 of the session token (the token itself is never stored) |
| expires_at | TEXT | Absolute expiry (8 h after sign-in) |
| last_seen_at | TEXT | Used for the 30-minute idle timeout |
| created_at | TEXT | Creation time |

### doctor_patient_assignments

Which clinician may see which patient. Unique on (doctor_id, patient_id).

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| doctor_id | INTEGER | Foreign key to **users** (clinician) |
| patient_id | TEXT | Foreign key to patients |
| assigned_at | TEXT | Assignment time |

### audit_events

Append-only record of sign-ins, lockouts, password changes, patient views, denied access, status changes, report creation and every AI request (patient data sent to Gemini).

| Column | Type | Description |
|--------|------|-------------|
| at | TEXT | Timestamp |
| user_id | INTEGER | Acting user (nullable) |
| action | TEXT | e.g. `patient.view`, `ai.chat`, `patient.access_denied` |
| patient_id | TEXT | Patient concerned, if any |
| outcome | TEXT | `success`, `failure` or `denied` |
| detail | JSON | Extra context |
| ip | TEXT | Client IP as reported by the reverse proxy |

## 🔌 Server Actions & Access Control

There are no REST endpoints; the UI calls Server Actions in `src/lib/actions/`. Every action re-checks the session and, for patient data, the caller's access:

| Role | Patients visible |
|------|------------------|
| `admin` | All |
| `clinician` | Assigned in `doctor_patient_assignments` |
| `researcher`, `user` | None |

Requests for a patient outside the caller's scope return "not found" and are written to the audit log.
`src/proxy.ts` additionally redirects signed-out users away from app pages and sets a per-request nonce Content-Security-Policy.

## 📜 Available Scripts

```bash
# Development
yarn dev              # Start development server
yarn build            # Build for production
yarn start            # Start production server
yarn lint             # Run ESLint

# Database
yarn db:generate      # Generate a migration from schema changes
yarn db:apply         # Apply pending migrations
yarn db:migrate       # generate + apply
yarn db:seed          # Create initial accounts
yarn db:studio        # Open Drizzle Studio (database GUI)

# Accounts
yarn user:set-password <email>   # Reset a password and revoke that user's sessions
```

## 🔧 Drizzle Studio

View and manage your database visually:

```bash
yarn db:studio
```

This opens Drizzle Studio at `https://local.drizzle.studio`

## 🐛 Troubleshooting

### Permission Errors

If you encounter `EPERM` errors:

```bash
# Fix ownership
sudo chown -R $(whoami) /Users/musahibrahimali/Dev/typescript/Care4RareDiseases

# Reinstall dependencies
rm -rf node_modules
yarn install
```

### Database Issues

Reset the database:

```bash
# Remove database file
rm data/care4rare.db

# Recreate and seed
yarn db:push
yarn db:seed
```

### Database Locked

If you get "database is locked" errors:

1. Close Drizzle Studio if running
2. Delete `.db-shm` and `.db-wal` files in the `data/` directory
3. Restart the development server

### Port Already in Use

Run on a different port:

```bash
yarn dev -- -p 3001
```

## 🚢 Deployment

### Environment Variables

Set these in your production environment:

```env
NODE_ENV=production
GEMINI_API_KEY=<key>
```

Serve over HTTPS behind a reverse proxy that overwrites `X-Forwarded-For` (used for audit IPs and per-IP login throttling). In production the session cookie uses the `__Host-` prefix and HSTS is enabled.

### Build and Deploy

```bash
# Build the application
yarn build

# Start production server
yarn start
```

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)

## 🔒 Security Notes

Implemented:
- Opaque, hashed, revocable sessions; 30-minute idle and 8-hour absolute expiry; `SameSite=Strict` cookies
- Server-side authorization on every action (role + patient assignment); denied access is audited
- Login throttling: 5 failures per account → 15-minute lockout; 30 attempts per IP per 15 minutes
- Nonce-based CSP, HSTS, `X-Frame-Options`, `nosniff`, `Referrer-Policy: no-referrer`, `Permissions-Policy`
- zod validation of all action inputs; patient data passed to Gemini as delimited data under a system instruction
- Audit log of PHI access and AI requests

Operational responsibilities:
- Rotate any secrets that were ever committed, and keep `.env*` and `data/` out of git
- Confirm your Gemini terms (or a BAA) permit sending patient data before enabling AI features
- The login throttle is in-memory: move it to a shared store if you run more than one instance
- Back up `data/care4rare.db`; it contains PHI, so encrypt backups

## 📝 License

This project is for educational and research purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For issues or questions:
- Check the troubleshooting section above
- Review the documentation links
- Open an issue on the repository