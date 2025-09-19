#!/bin/bash

set -e

# Set your project directory
PROJECT_DIR="/home/alexh/Rally"

cd "$PROJECT_DIR"

echo "Pulling latest code..."
git pull origin main

echo "Installing backend dependencies..."
cd backend
npm ci

echo "Running backend migrations..."
npx prisma migrate deploy

echo "Restarting backend..."
# You can use pm2, or kill and restart the process, or use nodemon for dev
pm2 delete rally-backend || true
pm2 start npm --name rally-backend -- run start:prod

cd ..

echo "Installing frontend dependencies..."
cd frontend
npm ci

echo "Building frontend..."
npm run build

echo "Restarting frontend server..."
pm2 delete rally-frontend || true
pm2 start "npx serve -s dist -l 49170" --name rally-frontend

echo "Deployment complete!"