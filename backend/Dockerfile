FROM node:14
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY server.js .
COPY images .
EXPOSE 3001
CMD ["node", "server.js"]
