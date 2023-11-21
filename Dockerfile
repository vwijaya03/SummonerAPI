FROM node:20.9.0

# Install Redis CLI for debugging (optional)
RUN apt-get update && \
    apt-get install -y redis-tools

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:dev"]