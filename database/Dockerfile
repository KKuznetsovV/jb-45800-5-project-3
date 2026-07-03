# Stage 1: compile TypeScript seeder
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: MongoDB image with Node.js + compiled seeder embedded
FROM mongo:7.0

# Install Node.js 20 via NodeSource
RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

# Copy compiled seeder and production deps
WORKDIR /seed
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist

# Shell script that docker-entrypoint-initdb.d runs on first DB init
COPY init-seed.sh /docker-entrypoint-initdb.d/01-seed.sh
RUN chmod +x /docker-entrypoint-initdb.d/01-seed.sh
