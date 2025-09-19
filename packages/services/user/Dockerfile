FROM node:20-alpine AS builder
WORKDIR /app

# Copy shared and service package files and tsconfigs
COPY packages/shared/package*.json ./packages/shared/
COPY packages/shared/tsconfig.json ./packages/shared/
COPY packages/services/user/package*.json ./packages/services/user/
COPY packages/services/user/tsconfig.json ./packages/services/user/

# Install dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# Copy source code
COPY packages/shared/interfaces ./packages/shared/interfaces
COPY packages/services/user/src ./packages/services/user/src

# Build shared and user service using project references
RUN npx tsc -b packages/shared packages/services/user

# --- Production image ---
FROM node:20-alpine AS production
WORKDIR /app

# Copy only package files and install production dependencies
COPY packages/services/user/package*.json ./packages/services/user/
COPY package.json ./
COPY package-lock.json ./
RUN npm install --only=production

# Copy built files from builder
COPY --from=builder /app/packages/services/user/dist ./dist

# Create non-root user and set ownership
RUN addgroup -S app && adduser -S app -G app \
    && chown -R app:app /app
USER app

CMD ["node", "dist/app.js"]