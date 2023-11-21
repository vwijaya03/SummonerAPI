FROM node:20.9.0
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

# Additional stage for Redis
FROM redis:latest AS redis
EXPOSE 6379

# Additional stage for PostgreSQL
FROM postgres:16 AS postgres

# PostgreSQL environment variables
ENV POSTGRES_DB lol
ENV POSTGRES_USER lol
ENV POSTGRES_PASSWORD lol

EXPOSE 5432

CMD ["npm", "run", "start"]