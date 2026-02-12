import { db } from './index.js';
import { users } from './schema.js';
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

        console.log('\n✅ Database seeding completed successfully!');
        console.log('\n📊 Summary:');
        console.log(`  - ${defaultUsers.length} users (1 admin + 3 clinicians)`);
        console.log('\n🔐 Default credentials:');
        console.log('  Admin: admin@care4rare.com / admin123');
        console.log('  Clinicians: dr.*.care4rare.com / clinician123');
        console.log('\n💡 Note: Patient and report data can be added through the UI');

        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
