FROM node:20-slim AS builder

WORKDIR /app

COPY package*.json ./
COPY .env ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:20-slim

WORKDIR /app

# Instalar netcat-openbsd ao invés de netcat-traditional
RUN apt-get update && \
  apt-get install -y netcat-openbsd && \
  rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.env ./

COPY docker-entrypoint.sh ./

RUN sed -i 's/\r$//g' /app/docker-entrypoint.sh
RUN npm ci --only=production && \
  chmod +x /app/docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/bin/bash", "/app/docker-entrypoint.sh"]