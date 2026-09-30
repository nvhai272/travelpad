# Build: docker build -f apps/api/Dockerfile -t travelpad-api .   (chạy từ gốc repo)
FROM node:22-bookworm-slim AS base
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/* \
  && npm i -g pnpm@10.15.0 turbo@2
WORKDIR /repo

FROM base AS pruned
COPY . .
RUN turbo prune @travelpad/api --docker

FROM base AS build
COPY --from=pruned /repo/out/json/ .
# --ignore-scripts: lúc này mới có package.json, chưa có prisma/schema.prisma cho postinstall `prisma generate`.
RUN pnpm install --frozen-lockfile --ignore-scripts
COPY --from=pruned /repo/out/full/ .
RUN pnpm --filter @travelpad/api exec prisma generate \
  && pnpm turbo run build --filter=@travelpad/api... \
  && pnpm --filter @travelpad/api deploy --prod --legacy /out \
  && cd /out && node_modules/.bin/prisma generate

FROM node:22-bookworm-slim AS runtime
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /out .
USER node
EXPOSE 4000
# Áp migration trước khi chạy (Render Free không có bước pre-deploy) – idempotent, chỉ chạy migration chưa áp.
CMD ["sh", "-c", "node_modules/.bin/prisma migrate deploy && node dist/main.js"]
