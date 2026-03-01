#!/bin/bash
set -e

echo "=== Orion Studio Deploy ==="

# Pull latest code
git pull origin main

# Build and restart
docker compose up -d --build

echo "=== Deploy complete ==="
