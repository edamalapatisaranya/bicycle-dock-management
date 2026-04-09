#!/bin/bash

set -e

export PORT=${PORT:-3000}
export FRONTEND_PORT=${FRONTEND_PORT:-5173}
export MONGO_URI=${MONGO_URI:-"mongodb://localhost:27017/bicycle_dock_db"}

# Load nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

# Use Node 20 (install if missing)
if ! nvm use 20 &>/dev/null; then
  echo "Installing Node.js v20..."
  nvm install 20
fi
echo "Node $(node --version) | npm $(npm --version)"

# ---- MongoDB Setup ----
if ! command -v mongod &>/dev/null; then
  echo "MongoDB not found. Installing MongoDB 6.0..."
  wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo gpg --dearmor -o /usr/share/keyrings/mongodb-server-6.0.gpg 2>/dev/null
  echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-6.0.gpg ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" \
    | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list >/dev/null
  sudo apt-get update -qq
  sudo apt-get install -y -qq mongodb-org
  echo "MongoDB installed."
fi

if ! pgrep -x "mongod" >/dev/null; then
  echo "Starting MongoDB..."
  sudo systemctl start mongod
  sleep 2
fi
echo "MongoDB is running."

# ---- Install Dependencies ----
echo "Installing backend dependencies..."
npm install

echo "Installing frontend dependencies..."
npm install --prefix frontend

# ---- Cleanup on exit ----
cleanup() {
  echo ""
  echo "Shutting down..."
  [ -n "$BACKEND_PID" ] && kill "$BACKEND_PID" 2>/dev/null
  [ -n "$FRONTEND_PID" ] && kill "$FRONTEND_PID" 2>/dev/null
  wait 2>/dev/null
  echo "Done."
}
trap cleanup EXIT INT TERM

# ---- Start Backend ----
echo "Starting backend on port $PORT..."
node src/index.js &
BACKEND_PID=$!

# ---- Start Frontend ----
echo "Starting frontend on port $FRONTEND_PORT..."
(cd frontend && npx vite --port "$FRONTEND_PORT" --host) &
FRONTEND_PID=$!

echo ""
echo "========================================="
echo "  Backend:  http://localhost:$PORT"
echo "  Frontend: http://localhost:$FRONTEND_PORT"
echo "  Swagger:  http://localhost:$PORT/api-docs"
echo "========================================="
echo ""

# Wait for either process to exit
wait
