FROM node:20
WORKDIR /app
COPY services/order/package*.json ./
RUN npm install
COPY services/order ./
COPY libs ./libs
RUN npm run build
CMD ["npm", "run", "dev"]