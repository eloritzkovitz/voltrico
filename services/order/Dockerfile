FROM node:20 AS builder
WORKDIR /app

# Copy package files and install all dependencies
COPY services/order/package*.json ./
COPY services/order/tsconfig.json ./
RUN npm install

# Copy source code and build
COPY services/order/src ./src
RUN npm run build

# --- Production image ---
FROM node:20 AS production
WORKDIR /app

# Copy only package files and install production dependencies
COPY services/order/package*.json ./
RUN npm install --only=production

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Copy any needed config files
COPY services/order/nodemon.json ./
COPY services/order/eslint.config.js ./

CMD ["node", "dist/app.js"]