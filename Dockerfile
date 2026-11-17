# syntax=docker/dockerfile:1

# ─────────────────────────────────────────────────────────────
# Stage 1: Build
# ─────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

# npm cache mount — 套件不重新下載（只要 package-lock 沒變）
RUN --mount=type=cache,target=/root/.npm \
    npm ci

COPY . .

ARG NEXT_PUBLIC_SITE_URL=https://example.com
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
ENV NEXT_TELEMETRY_DISABLED=1

# Next.js build cache mount — 增量編譯，只重新編譯有改動的部分
RUN --mount=type=cache,target=/app/.next/cache \
    npm run build


# ─────────────────────────────────────────────────────────────
# Stage 2: Production runner (minimal image)
# ─────────────────────────────────────────────────────────────
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/_posts      ./_posts
COPY --from=builder /app/_projects   ./_projects
COPY --from=builder /app/_changelog  ./_changelog

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
