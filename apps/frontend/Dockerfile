# Use Node.js 22 LTS Alpine base image (required for @tanstack/react-start@1.134.15)
FROM node:22-alpine

# Install pnpm and su-exec globally
RUN npm install -g pnpm@9.15.4 && \
    apk add --no-cache su-exec

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

# Copy entrypoint script for permission handling
COPY apps/frontend/docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Change ownership to node user for security
RUN chown -R node:node /app

# Expose frontend port
EXPOSE 5173

# Use entrypoint script to fix permissions and switch to node user
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]

# Start development server with host binding for HMR
CMD ["pnpm", "--filter", "@cv-hub/frontend", "run", "dev", "--host", "0.0.0.0"]
