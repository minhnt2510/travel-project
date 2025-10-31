#!/bin/bash

echo "Starting Travel App Development Environment..."
echo ""

# Start backend
echo "[1/3] Starting Backend Server..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait a bit for backend to start
sleep 3

# Seed database if needed
echo "[2/3] Seeding Database..."
cd backend
npm run seed
cd ..

# Start frontend
echo "[3/3] Starting Frontend (Expo)..."
cd Travel-App
npm start &
FRONTEND_PID=$!

echo ""
echo "✅ Development servers started!"
echo ""
echo "Backend: http://localhost:4000"
echo "Frontend: Expo DevTools will open automatically"
echo ""
echo "Press Ctrl+C to stop all servers..."

# Wait for user interrupt
wait

