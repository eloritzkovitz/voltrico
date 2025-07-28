FROM node:20
WORKDIR /app

# Copy package files first for better cache
COPY services/user/package*.json ./
COPY voltrico-libs-*.tgz ./

# Install dependencies
RUN npm install

# Copy the rest of the service source code
COPY services/user ./

# Build the service
RUN npm run build

CMD ["npm", "run", "dev"]