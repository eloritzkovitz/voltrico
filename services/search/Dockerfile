FROM node:20
WORKDIR /app

# Copy package files first for better cache
COPY services/search/package*.json ./
COPY voltrico-libs-*.tgz ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY services/search ./

# Build the service
RUN npm run build

CMD ["npm", "run", "dev"]