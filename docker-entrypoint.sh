#!/bin/bash
set -e

echo "Waiting for postgres..."
until nc -z postgres 5432; do
    sleep 1
done
echo "PostgreSQL started"

echo "Running migrations..."
npm run migration:run

echo "Starting application..."
exec npm run start:prod