# Build: docker build -f apps/web/Dockerfile -t travelpad-web .   (chạy từ gốc repo)
FROM node:22-bookworm-slim AS base
RUN npm i -g pnpm@10.15.0 turbo@2
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /repo

FROM base AS pruned
COPY . .
RUN turbo prune @travelpad/web --docker

FROM base AS build
COPY --from=pruned /repo/out/json/ .
RUN pnpm install --frozen-lockfile
COPY --from=pruned /repo/out/full/ .
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SITE_URL
RUN pnpm turbo run build --filter=@travelpad/web...

FROM node:22-bookworm-slim AS runtime
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0
WORKDIR /app
COPY --from=build /repo/apps/web/.next/standalone ./
COPY --from=build /repo/apps/web/.next/static ./apps/web/.next/static
COPY --from=build /repo/apps/web/public ./apps/web/public
USER node
EXPOSE 3000
CMD ["node", "apps/web/server.js"]
