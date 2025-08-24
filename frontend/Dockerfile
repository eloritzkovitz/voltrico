# Build stage
FROM node:20 AS build
WORKDIR /app

# Install dependencies and build the app
COPY package*.json ./
COPY tsconfig*.json ./
COPY postcss.config.mjs ./
COPY next.config.ts ./
COPY public ./public
COPY src ./src
RUN npm install
RUN npm run build

# Production stage: run with Node.js
FROM node:20-alpine AS production
WORKDIR /app

# Copy built assets and dependencies from build stage
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules

EXPOSE 80
ENV NODE_ENV=production
ENV PORT=80

CMD ["npx", "next", "start"]