FROM node:14
WORKDIR /app
# Copy package files and install dependencies first for better caching
COPY package*.json ./
RUN npm install
# Copy the rest of the application
COPY . .
# No need for these lines since your images are already in the images directory
# RUN mkdir -p /app/images
# COPY src/downloadImages.js /app/src/
# RUN node src/downloadImages.js
EXPOSE 3001
CMD ["node", "server.js"]
