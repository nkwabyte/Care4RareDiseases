#!/bin/bash

# Script to seed the Care4RareDiseases database
# Seeds users and doctors for authentication

set -e  # Exit on error

echo "🌱 Starting database seeding..."
echo ""

# Check if database exists
DB_PATH="data/care4rare.db"
if [ ! -f "$DB_PATH" ]; then
    echo "❌ Database not found: $DB_PATH"
    echo "💡 Run 'yarn db:push' first to create the database"
    exit 1
fi

echo "📊 Database found at: $DB_PATH"
echo ""

# Run the seed script using Node.js and TypeScript
echo "🚀 Seeding users and doctors..."
echo ""

if npx tsx src/lib/db/seed-drizzle.ts; then
    echo ""
    echo "✅ Database seeding completed successfully!"
    echo ""
    echo "📈 Summary:"
    echo "   - 4 Users (1 admin + 3 clinicians)"
    echo "   - 4 Doctors"
    echo ""
    echo "🔐 You can now login with:"
    echo "   Email: admin@care4rare.com"
    echo "   Password: admin123"
    echo ""
    echo "💡 Note: Patient and report data can be added through the UI"
else
    echo ""
    echo "❌ Seeding failed!"
    echo "💡 Check the error messages above for details"
    exit 1
fi
