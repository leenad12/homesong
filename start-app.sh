#!/bin/bash

echo "🚀 Starting HomeSong App..."
echo ""

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Port $1 is already in use"
        return 1
    else
        return 0
    fi
}

# Kill any existing processes
echo "🧹 Cleaning up existing processes..."
pkill -f "node server.js" 2>/dev/null
pkill -f "vite" 2>/dev/null
sleep 2

# Start backend
echo "🔧 Starting backend server..."
cd /Users/leenadudi/homesong
node server.js &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Check if backend started successfully
if ! check_port 3000; then
    echo "❌ Backend failed to start on port 3000"
    exit 1
fi

echo "✅ Backend running on http://localhost:3000"

# Start frontend
echo "🎨 Starting frontend server..."
cd /Users/leenadudi/Downloads/Frontend\ Website\ for\ Homesong
npm run dev &
FRONTEND_PID=$!

# Wait for frontend to start
sleep 5

# Find which port the frontend is using
FRONTEND_PORT=$(lsof -ti:5173,5174,5175 | head -1 | xargs lsof -p | grep LISTEN | grep -E ':(5173|5174|5175)' | awk '{print $9}' | cut -d: -f2 | head -1)

if [ -z "$FRONTEND_PORT" ]; then
    echo "❌ Frontend failed to start"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo "✅ Frontend running on http://localhost:$FRONTEND_PORT"
echo ""
echo "🎉 HomeSong App is ready!"
echo "📱 Open your browser to: http://localhost:$FRONTEND_PORT"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
wait
