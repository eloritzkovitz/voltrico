FROM node:20-alpine AS builder
WORKDIR /app

# Copy shared and service package files and tsconfigs
COPY packages/shared/package*.json ./packages/shared/
COPY packages/shared/tsconfig.json ./packages/shared/
COPY packages/services/cart/package*.json ./packages/services/cart/
COPY packages/services/cart/tsconfig.json ./packages/services/cart/

# Install dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# Copy source code
COPY packages/shared/interfaces ./packages/shared/interfaces
COPY packages/services/cart/src ./packages/services/cart/src

# Build shared and cart service using project references
RUN npx tsc -b packages/shared packages/services/cart

# --- Production image ---
FROM node:20-alpine AS production
WORKDIR /app

# Copy only package files and install production dependencies
COPY packages/services/cart/package*.json ./packages/services/cart/
COPY package.json ./
COPY package-lock.json ./
RUN npm install --only=production

# Copy built files from builder
COPY --from=builder /app/packages/services/cart/dist ./dist

CMD ["node", "dist/app.js"]