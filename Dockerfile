FROM node:19.6.0-alpine3.17
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 8001
CMD ["node", "app.js"]