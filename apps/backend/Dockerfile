# Use Node.js 20 LTS Alpine base image
FROM node:20-alpine

# Install pnpm globally
RUN npm install -g pnpm@9.15.4

# Install curl for health checks
RUN apk add --no-cache curl

# Set working directory
WORKDIR /app

# Copy workspace configuration files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy package.json files for all workspace packages
COPY apps/backend/package.json ./apps/backend/
COPY packages/shared-types/package.json ./packages/shared-types/

# Install dependencies with frozen lockfile
RUN pnpm install --frozen-lockfile

# Copy application source code
COPY apps/backend ./apps/backend
COPY packages ./packages

# Create data directory for SQLite
RUN mkdir -p /app/apps/backend/data

# Change ownership to node user for security
RUN chown -R node:node /app

# Switch to non-root user
USER node

# Expose backend port
EXPOSE 3000

# Start development server with hot-reload
CMD ["pnpm", "--filter", "@cv-hub/backend", "run", "start:dev"]
