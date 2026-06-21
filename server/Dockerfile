FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY server/package*.json ./server/

RUN npm ci --include-workspace-root --workspace=server

COPY server ./server

WORKDIR /app/server
RUN npm run build

FROM node:24-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY package*.json ./
COPY server/package*.json ./server/

RUN npm ci --omit=dev --include-workspace-root --workspace=server

COPY --from=builder /app/server/dist ./server/dist

WORKDIR /app/server

EXPOSE 3000

CMD ["node", "dist/main.js"]
