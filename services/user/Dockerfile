FROM node:20
WORKDIR /app
COPY services/user/package*.json ./
RUN npm install
COPY services/user ./
COPY libs ./libs
RUN npm run build
CMD ["npm", "run", "dev"]