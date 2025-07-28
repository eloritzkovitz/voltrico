# Build stage
FROM node:20 AS build
WORKDIR /app

# Install dependencies and build the app
COPY package*.json ./
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY public ./public
COPY src ./src
RUN npm install
RUN npm run build

# Production stage: serve with Nginx
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy built assets from previous stage
COPY --from=build /app/dist .

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]