FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY client/package*.json ./client/

RUN npm ci --workspace=client

COPY client ./client

WORKDIR /app/client
RUN npm run build

FROM node:24-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

COPY package*.json ./
COPY client/package*.json ./client/

RUN npm ci --omit=dev --workspace=client

COPY --from=builder /app/client/dist/client ./client/dist/client

WORKDIR /app/client

EXPOSE 4000

CMD ["node", "dist/client/server/server.mjs"]
