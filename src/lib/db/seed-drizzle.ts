import { db } from './index.js';
import { users, patients, reports } from './schema.js';
import { PATIENTS } from '../data/patientData.js';
import { REPORTS } from '../data/reportsData.js';
import { DATABASE_PATIENTS } from '../data/databaseData.js';
import bcrypt from 'bcrypt';

console.log('Starting database seeding...\n');

async function seedDatabase() {
    try {
        // Seed default users
        console.log('👥 Seeding users...');
        const defaultUsers = [
            {
                email: 'admin@care4rare.com',
                passwordHash: await bcrypt.hash('admin123', 10),
                name: 'System Administrator',
                role: 'admin' as const,
                isActive: true,
            },
            {
                email: 'dr.asante@care4rare.com',
                passwordHash: await bcrypt.hash('clinician123', 10),
                name: 'Dr. Ama Asante',
                role: 'clinician' as const,
                isActive: true,
            },
            {
                email: 'dr.mensah@care4rare.com',
                passwordHash: await bcrypt.hash('clinician123', 10),
                name: 'Dr. Kwame Mensah',
                role: 'clinician' as const,
                isActive: true,
            },
            {
                email: 'dr.osei@care4rare.com',
                passwordHash: await bcrypt.hash('clinician123', 10),
                name: 'Dr. Abena Osei',
                role: 'clinician' as const,
                isActive: true,
            },
        ];

        for (const user of defaultUsers) {
            await db.insert(users).values(user).onConflictDoNothing();
        }

        console.log(`✓ Seeded ${defaultUsers.length} users`);

        // Seed patients
        console.log('\nSeeding patients...');
        const patientRecords = Object.values(PATIENTS).map((patient) => {
            // Find corresponding database patient for status info
            const dbPatient = DATABASE_PATIENTS.find(p => p.patientId === patient.id);

            return {
                id: patient.id,
                age: patient.age,
                sex: patient.sex,
                genomicFile: patient.genomicFile || null,
                clinicalNotes: patient.clinicalNotes || null,
                phenotypes: patient.phenotypes,
                variantInfo: patient.variantInfo || null,
                knowledgeGraph: patient.knowledgeGraph || null,
                status: dbPatient?.status || 'Pending Analysis',
                lastUpdated: dbPatient?.lastUpdated || new Date().toISOString().split('T')[0],
                assignedClinician: dbPatient?.assignedClinician || null,
            };
        });

        // Insert patients
        for (const patient of patientRecords) {
            await db.insert(patients).values(patient).onConflictDoNothing();
        }

        console.log(`✓ Seeded ${patientRecords.length} patients with full clinical data`);

        // Seed reports
        console.log('\nSeeding reports...');
        const reportRecords = REPORTS.map((report) => ({
            id: report.id,
            patientId: report.patientId,
            patientName: report.patientName,
            dateGenerated: report.dateGenerated,
            generatedBy: report.generatedBy,
        }));

        // Insert reports
        for (const report of reportRecords) {
            await db.insert(reports).values(report).onConflictDoNothing();
        }

        console.log(`✓ Seeded ${reportRecords.length} reports`);

        console.log('\nDatabase seeding completed successfully!');
        console.log('\nSummary:');
        console.log(`  - ${defaultUsers.length} users (admin + clinicians)`);
        console.log(`  - ${patientRecords.length} patients with full clinical data`);
        console.log(`  - ${reportRecords.length} reports`);
        console.log('\nDefault credentials:');
        console.log('  Admin: admin@care4rare.com / admin123');
        console.log('  Clinicians: dr.asante@care4rare.com / clinician123');

        process.exit(0);
    } catch (error) {
        console.error('\nError seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
