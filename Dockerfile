FROM node:20-slim AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .
RUN npm run build

FROM node:20-slim

WORKDIR /app

RUN apt-get update && \
    apt-get install -y netcat-openbsd postgresql-client && \
    rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package*.json /app/
COPY --from=builder /app/docker-entrypoint.sh /app/

RUN npm ci --only=production --omit=dev && \
    chmod +x /app/docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/bin/bash", "/app/docker-entrypoint.sh"]
