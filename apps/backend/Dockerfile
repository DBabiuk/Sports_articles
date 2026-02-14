FROM node:20-alpine

RUN corepack enable && corepack prepare pnpm@10.29.3 --activate
WORKDIR /app

COPY . .

RUN pnpm install --frozen-lockfile

WORKDIR /app/apps/backend

EXPOSE 4000
CMD ["pnpm", "dev"]
