FROM node:20-slim AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .
COPY .env ./

RUN npm run build
RUN ls -la dist/

FROM node:20-slim

WORKDIR /app

RUN apt-get update && \
    apt-get install -y netcat-openbsd && \
    rm -rf /var/lib/apt/lists/*

# Copiar apenas o necessário
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.env ./
COPY docker-entrypoint.sh ./

RUN npm ci --only=production && \
    chmod +x docker-entrypoint.sh && \
    sed -i 's/\r$//g' docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/bin/bash", "docker-entrypoint.sh"]