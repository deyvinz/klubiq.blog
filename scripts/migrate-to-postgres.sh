#!/bin/bash

# Stop Strapi if it's running
pm2 stop strapi || true

# Install PostgreSQL client
npm install pg

# Create backup of SQLite database
cp .tmp/data.db .tmp/data.db.backup

# Export data from SQLite
npx strapi export --file sqlite-export

# Update database configuration
cat > config/database.js << 'EOL'
module.exports = ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: env('DATABASE_HOST', 'localhost'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME', 'strapi_db'),
      user: env('DATABASE_USERNAME', 'strapi'),
      password: env('DATABASE_PASSWORD', 'your_password'),
      schema: env('DATABASE_SCHEMA', 'public'),
      ssl: env.bool('DATABASE_SSL', false) && {
        rejectUnauthorized: env.bool('DATABASE_SSL_SELF', false),
      },
    },
    debug: false,
  },
})
EOL

# Build the application
npm run build

# Import data into PostgreSQL
npx strapi import --file sqlite-export.tar.gz.enc

# Start Strapi
pm2 start npm --name strapi -- start

echo "Migration complete! Please verify your data in the Strapi admin panel."
echo "If everything looks good, you can remove the SQLite backup:"
echo "rm .tmp/data.db.backup"
echo "rm sqlite-export.tar.gz.enc" 