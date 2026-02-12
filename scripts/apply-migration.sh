#!/bin/bash

# Script to apply the latest Drizzle migration to SQLite database
# This handles schema changes including the new reports table

set -e  # Exit on error

DB_PATH="data/care4rare.db"
MIGRATIONS_DIR="drizzle"

echo "📦 Applying database migrations..."
echo ""

# Check if migrations directory exists
if [ ! -d "$MIGRATIONS_DIR" ]; then
    echo "⚠️  Migrations directory not found: $MIGRATIONS_DIR"
    echo "💡 Generating migrations first..."
    npx drizzle-kit generate
fi

# Check if database exists
if [ ! -f "$DB_PATH" ]; then
    echo "⚠️  Database not found: $DB_PATH"
    echo "💡 Creating database with schema..."
    npx drizzle-kit push
    echo "✅ Database created successfully!"
    exit 0
fi

# Find the latest migration file (highest numbered .sql file)
LATEST_MIGRATION=$(ls -1 "$MIGRATIONS_DIR"/*.sql 2>/dev/null | sort -r | head -n 1)

if [ -z "$LATEST_MIGRATION" ]; then
    echo "⚠️  No migration files found in $MIGRATIONS_DIR"
    echo "💡 Using drizzle-kit push instead..."
    npx drizzle-kit push
    echo "✅ Schema pushed successfully!"
else
    echo "� Applying migration: $(basename "$LATEST_MIGRATION")"
    
    # Apply the migration
    if sqlite3 "$DB_PATH" < "$LATEST_MIGRATION"; then
        echo "✅ Migration applied successfully!"
    else
        echo "❌ Migration failed!"
        echo "💡 Trying drizzle-kit push as fallback..."
        npx drizzle-kit push
    fi
fi

echo ""
echo "📊 Verifying database schema:"
echo ""

# Verify key tables exist
echo "Checking tables:"
TABLES=$(sqlite3 "$DB_PATH" "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;")

for table in users doctors sessions patients reports doctor_patient_assignments; do
    if echo "$TABLES" | grep -q "^$table$"; then
        echo "  ✅ $table"
    else
        echo "  ❌ $table (missing)"
    fi
done

echo ""
echo "🎉 Migration complete!"
