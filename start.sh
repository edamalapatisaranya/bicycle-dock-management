#!/bin/bash

set -e

export PORT=${PORT:-3000}
export MONGO_URI=${MONGO_URI:-"mongodb://localhost:27017/bicycle_dock_db"}

# Load nvm if available
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

# ---- MongoDB Setup ----
if ! command -v mongod &> /dev/null; then
  echo "MongoDB not found. Installing MongoDB 6.0..."

  wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo gpg --dearmor -o /usr/share/keyrings/mongodb-server-6.0.gpg 2>/dev/null

  echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-6.0.gpg ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list > /dev/null

  sudo apt-get update -qq
  sudo apt-get install -y -qq mongodb-org

  echo "MongoDB installed."
fi

# Start MongoDB if not running
if ! pgrep -x "mongod" > /dev/null; then
  echo "Starting MongoDB..."
  sudo systemctl start mongod
  sleep 2
fi

echo "MongoDB is running."

# ---- Node.js Dependencies ----
echo "Installing Node.js dependencies..."
npm install express@4.18.2 mongoose@6.12.3 uuid@8.3.2 swagger-ui-express@4.6.3

# ---- Start App ----
echo "Starting backend on port $PORT..."
echo "MongoDB URI: $MONGO_URI"

node src/index.js
