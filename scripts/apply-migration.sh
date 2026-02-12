#!/bin/bash

# Script to apply the latest Drizzle migration to SQLite database
# This is needed because drizzle-kit push doesn't work with manually created databases

set -e  # Exit on error

DB_PATH="data/care4rare.db"
MIGRATIONS_DIR="drizzle"

# Check if migrations directory exists
if [ ! -d "$MIGRATIONS_DIR" ]; then
    echo "❌ Migrations directory not found: $MIGRATIONS_DIR"
    exit 1
fi

# Check if database exists
if [ ! -f "$DB_PATH" ]; then
    echo "❌ Database not found: $DB_PATH"
    exit 1
fi

# Find the latest migration file (highest numbered .sql file)
LATEST_MIGRATION=$(ls -1 "$MIGRATIONS_DIR"/*.sql 2>/dev/null | sort -r | head -n 1)

if [ -z "$LATEST_MIGRATION" ]; then
    echo "❌ No migration files found in $MIGRATIONS_DIR"
    exit 1
fi

echo "📦 Applying migration: $(basename "$LATEST_MIGRATION")"

# Apply the migration
if sqlite3 "$DB_PATH" < "$LATEST_MIGRATION"; then
    echo "✅ Migration applied successfully!"
    
    # Verify the sessions table structure
    echo ""
    echo "📊 Verifying sessions table structure:"
    sqlite3 "$DB_PATH" ".schema sessions"
else
    echo "❌ Migration failed!"
    exit 1
fi
