# Syntax: docker/dockerfile:1

FROM node:20-bookworm-slim AS base
WORKDIR /app

# Prisma a besoin d'OpenSSL à l'exécution (et parfois au build).
RUN apt-get update -y \
	&& apt-get install -y --no-install-recommends openssl ca-certificates \
	&& rm -rf /var/lib/apt/lists/*

FROM base AS deps
WORKDIR /app

# Install dependencies first (better layer caching)
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS build
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Fly n'injecte pas les secrets (ex: DATABASE_URL) au moment du build Docker.
# Prisma charge prisma.config.ts et exige DATABASE_URL même pour `prisma generate`.
# Un placeholder suffit ici (Prisma ne se connecte pas pendant generate).
ENV DATABASE_URL="postgresql://user:pass@localhost:5432/db?sslmode=disable"

# Build compiles TS and runs prisma generate (see package.json scripts)
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Keep image small: only what is needed to run
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./prisma.config.ts

EXPOSE 3000
CMD ["npm", "run", "start"]
