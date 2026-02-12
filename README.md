# Care4RareDiseases

A Next.js application for managing rare disease patient data with AI-powered analysis and knowledge graph visualization.

## 🚀 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Database**: SQLite with Drizzle ORM
- **State Management**: Redux Toolkit
- **Authentication**: JWT-based sessions with httpOnly cookies
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

- Node.js 18+ 
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

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Update the values:

```env
JWT_SECRET=your-very-long-random-secret-key-at-least-32-characters
NODE_ENV=development
```

> **Security**: Generate a strong JWT secret using: `openssl rand -base64 32`

### 3. Database Setup

#### Push Schema to Database

```bash
yarn db:push
```

This creates all necessary tables in the SQLite database.

#### Seed Initial Data

```bash
yarn db:seed
```

This populates the database with:
- 4 default users (1 admin + 3 clinicians)
- 9 patients with full clinical data
- 4 sample reports

### 4. Start Development Server

```bash
yarn dev
```

The application will be available at **http://localhost:3000**

## 🔐 Default Credentials

After seeding, you can log in with:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@care4rare.com | admin123 |
| Clinician | dr.asante@care4rare.com | clinician123 |
| Clinician | dr.mensah@care4rare.com | clinician123 |
| Clinician | dr.osei@care4rare.com | clinician123 |

> **⚠️ Important**: Change these passwords before deploying to production!

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

### doctors (Legacy)
Doctor accounts (maintained for backward compatibility)

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| email | TEXT | Unique email |
| passwordHash | TEXT | Bcrypt hashed password |
| name | TEXT | Doctor's name |
| specialty | TEXT | Medical specialty |

### sessions
Active user sessions

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| doctorId | INTEGER | Foreign key to doctors |
| token | TEXT | JWT token |
| expiresAt | TIMESTAMP | Session expiration |

### doctor_patient_assignments
Doctor-patient relationships

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| doctorId | INTEGER | Foreign key to doctors |
| patientId | TEXT | Patient identifier |
| assignedAt | TIMESTAMP | Assignment time |

## 🔌 API Endpoints

### Authentication

- **POST** `/api/auth/login` - Login with email and password
  ```json
  { "email": "admin@care4rare.com", "password": "admin123" }
  ```

- **POST** `/api/auth/logout` - Logout and clear session

- **GET** `/api/auth/session` - Check current session status

### Patients

- **GET** `/api/patients` - Get assigned patients for logged-in user

- **POST** `/api/patients` - Assign patient to user
  ```json
  { "patientId": "UDN-P4" }
  ```

## 📜 Available Scripts

```bash
# Development
yarn dev              # Start development server
yarn build            # Build for production
yarn start            # Start production server
yarn lint             # Run ESLint

# Database
yarn db:generate      # Generate Drizzle migrations
yarn db:push          # Push schema to database
yarn db:seed          # Seed database with initial data
yarn db:studio        # Open Drizzle Studio (database GUI)
yarn db:migrate       # Run migrations (alternative to push)
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
JWT_SECRET=<strong-random-secret>
NODE_ENV=production
```

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

1. **Change default passwords** before production deployment
2. **Use strong JWT secrets** (minimum 32 characters)
3. **Enable HTTPS** in production
4. **Regular security updates** for dependencies
5. **Implement rate limiting** on authentication endpoints
6. **Add CORS configuration** for production

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