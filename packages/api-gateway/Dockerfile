# --- Build Stage ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root package files and lockfile for workspaces
COPY package.json ./
COPY package-lock.json ./

# Copy api-gateway package files
COPY packages/api-gateway/package.json ./packages/api-gateway/
COPY packages/api-gateway/tsconfig.json ./packages/api-gateway/

# Install dependencies and build
RUN npm install

# Copy the rest of the api-gateway source code
COPY packages/api-gateway/src ./packages/api-gateway/src

WORKDIR /app/packages/api-gateway
RUN npm run build

# --- Production Stage ---
FROM node:20-alpine AS prod
WORKDIR /app

# Create non-root user and set ownership
RUN addgroup -S app && adduser -S app -G app \
    && chown -R app:app /app

# Copy only production node_modules and built files
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/api-gateway/package.json ./package.json
COPY --from=builder /app/packages/api-gateway/dist ./dist

USER app

CMD ["node", "dist/index.js"]