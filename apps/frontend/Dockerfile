# Use Node.js 20 LTS Alpine base image
FROM node:20-alpine

# Install pnpm globally
RUN npm install -g pnpm@9.15.4

# Set working directory
WORKDIR /app

# Copy workspace configuration files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy package.json files for all workspace packages
COPY apps/frontend/package.json ./apps/frontend/
COPY packages/shared-types/package.json ./packages/shared-types/

# Install dependencies with frozen lockfile
RUN pnpm install --frozen-lockfile

# Copy application source code
COPY apps/frontend ./apps/frontend
COPY packages ./packages

# Expose frontend port
EXPOSE 5173

# Start development server with host binding for HMR
CMD ["pnpm", "--filter", "@cv-hub/frontend", "run", "dev", "--host", "0.0.0.0"]
