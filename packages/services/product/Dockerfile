FROM node:20-alpine AS builder
WORKDIR /app

# Copy shared and service package files and tsconfigs
COPY packages/shared/package*.json ./packages/shared/
COPY packages/shared/tsconfig.json ./packages/shared/
COPY packages/services/product/package*.json ./packages/services/product/
COPY packages/services/product/tsconfig.json ./packages/services/product/

# Install dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# Copy source code
COPY packages/shared/interfaces ./packages/shared/interfaces
COPY packages/services/product/src ./packages/services/product/src

# Build shared and product service using project references
RUN npx tsc -b packages/shared packages/services/product

# --- Production image ---
FROM node:20-alpine AS production
WORKDIR /app

# Copy only package files and install production dependencies
COPY packages/services/product/package*.json ./packages/services/product/
COPY package.json ./
COPY package-lock.json ./
RUN npm install --only=production

# Copy built files from builder
COPY --from=builder /app/packages/services/product/dist ./dist

# Create non-root user and set ownership
RUN addgroup -S app && adduser -S app -G app \
    && chown -R app:app /app
USER app

CMD ["node", "dist/app.js"]