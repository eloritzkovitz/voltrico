FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files and install all dependencies
COPY services/user/package*.json ./
COPY services/user/tsconfig.json ./
RUN npm install

# Copy source code and build
COPY services/user/src ./src
RUN npm run build

# --- Production image ---
FROM node:20-alpine AS production
WORKDIR /app

# Copy only package files and install production dependencies
COPY services/user/package*.json ./
RUN npm install --only=production

# Copy built files from builder
COPY --from=builder /app/dist ./dist

CMD ["node", "dist/app.js"]