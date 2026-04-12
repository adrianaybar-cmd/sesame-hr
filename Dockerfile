# ─── Stage 1: Dependencies ────────────────────────────────────────────────────
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json .npmrc* ./
RUN npm ci --legacy-peer-deps

# ─── Stage 2: Builder ────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

ARG AUTH_SECRET=dummy-build-time-secret-not-used-at-runtime
ARG NEXTAUTH_URL=http://localhost:3000
ARG GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET

# Provide dummy values so next build doesn't fail on missing env checks
ENV AUTH_SECRET=${AUTH_SECRET}
ENV NEXTAUTH_URL=${NEXTAUTH_URL}

# Increase Node.js heap for large builds on low-memory VPS
ENV NODE_OPTIONS="--max-old-space-size=2048"

RUN npm run build

# ─── Stage 3: Runner ─────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Standalone output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

CMD ["node", "server.js"]
