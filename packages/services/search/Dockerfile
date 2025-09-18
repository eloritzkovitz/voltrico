FROM node:20-alpine AS builder
WORKDIR /app

# Copy shared and service package files and tsconfigs
COPY packages/shared/package*.json ./packages/shared/
COPY packages/shared/tsconfig.json ./packages/shared/
COPY packages/services/search/package*.json ./packages/services/search/
COPY packages/services/search/tsconfig.json ./packages/services/search/

# Install dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# Copy source code
COPY packages/shared/interfaces ./packages/shared/interfaces
COPY packages/services/search/src ./packages/services/search/src

# Build shared and search service using project references
RUN npx tsc -b packages/shared packages/services/search

# --- Production image ---
FROM node:20-alpine AS production
WORKDIR /app

# Copy only package files and install production dependencies
COPY packages/services/search/package*.json ./packages/services/search/
COPY package.json ./
COPY package-lock.json ./
RUN npm install --only=production

# Copy built files from builder
COPY --from=builder /app/packages/services/search/dist ./dist

CMD ["node", "dist/app.js"]