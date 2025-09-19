# Build stage
FROM node:20 AS build
WORKDIR /app

# Set environment variables
ARG NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL

ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=$NEXT_PUBLIC_GOOGLE_CLIENT_ID

# Copy only the necessary files for install and build
COPY package.json ./
COPY package-lock.json ./
COPY packages/web/package.json ./packages/web/
COPY packages/web/tsconfig*.json ./packages/web/
COPY packages/web/postcss.config.mjs ./packages/web/
COPY packages/web/next.config.ts ./packages/web/
COPY packages/web/public ./packages/web/public
COPY packages/web/src ./packages/web/src

# Copy shared package files and tsconfig
COPY packages/shared/tsconfig.json ./packages/shared/
COPY packages/shared/interfaces ./packages/shared/interfaces

RUN npm install --workspace=packages/web
RUN npm run build --workspace packages/web

# Production stage: run with Node.js
FROM node:20-alpine AS production
WORKDIR /app

# Copy package files and install only production dependencies
COPY packages/web/package.json ./
RUN npm install --omit=dev --ignore-scripts

# Copy built files and public assets
COPY --from=build /app/packages/web/.next ./.next
COPY --from=build /app/packages/web/public ./public

EXPOSE 80
ENV NODE_ENV=production
ENV PORT=80

# Create non-root user and set ownership
RUN addgroup -S app && adduser -S app -G app \
    && chown -R app:app /app
USER app

CMD ["npx", "next", "start"]