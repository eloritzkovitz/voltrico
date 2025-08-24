FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files and install all dependencies
COPY services/search/package*.json ./
COPY services/search/tsconfig.json ./
RUN npm install

# Copy source code and build
COPY services/search/src ./src
RUN npm run build

# --- Production image ---
FROM node:20-alpine AS production
WORKDIR /app

# Copy only package files and install production dependencies
COPY services/search/package*.json ./
RUN npm install --only=production

# Copy built files from builder
COPY --from=builder /app/dist ./dist

CMD ["node", "dist/app.js"]