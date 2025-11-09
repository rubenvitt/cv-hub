#!/bin/sh
# Frontend Docker Entrypoint Script
# Fixes permissions for anonymous volumes before starting dev server

set -e

# Fix ownership of node_modules if it's mounted as anonymous volume
# Only change ownership if we're running as root initially
if [ "$(id -u)" = "0" ]; then
  echo "Fixing node_modules ownership..."
  chown -R node:node /app/apps/frontend/node_modules 2>/dev/null || true
  chown -R node:node /app/node_modules 2>/dev/null || true

  # Switch to node user and execute the CMD
  exec su-exec node "$@"
else
  # Already running as node user, just execute
  exec "$@"
fi
