FROM node:20-alpine

WORKDIR /app

# Copy root package files and lockfile for workspaces
COPY package.json ./
COPY package-lock.json ./

# Copy api-gateway package files
COPY packages/api-gateway/package.json ./packages/api-gateway/
COPY packages/api-gateway/tsconfig.json ./packages/api-gateway/

# Install dependencies
RUN npm install

# Copy the rest of the api-gateway source code
COPY packages/api-gateway/src ./packages/api-gateway/src

WORKDIR /app/packages/api-gateway

RUN npm run build

CMD ["npm", "run", "start"]