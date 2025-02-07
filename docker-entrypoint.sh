#!/bin/bash
set -e

echo "Waiting for PostgreSQL..."
until pg_isready -h "$DB_HOST" -U "$DB_USERNAME"; do
  sleep 2
done
echo "PostgreSQL is up and running!"

echo "Running migrations..."
npm run migration:run

echo "Starting application..."
exec npm run start:prod