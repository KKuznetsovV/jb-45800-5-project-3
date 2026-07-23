# Stage 1: compile TypeScript seeder
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: standalone one-shot seeder image (runs as its own container,
# connects to the `database` service over the network, then exits).
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/seed.js"]
