# Backend Dockerfile
FROM node:18.17.1

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# FIXED: Expose correct port
EXPOSE 8080

# Start the app (adjust if your entry file is app.js or server.js)
CMD ["node", "index.js"]
