FROM node:20
WORKDIR /app
COPY services/product/package*.json ./
RUN npm install
COPY services/product ./
COPY libs ./libs
RUN npm run build
CMD ["npm", "run", "dev"]