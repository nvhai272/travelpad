# Image dev dùng chung cho mọi service Node (install, packages, api, web).
# Không cài gì lên host: node, pnpm, prisma, turbo... đều nằm trong image/container.
FROM node:22-bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates git \
  && rm -rf /var/lib/apt/lists/* \
  && npm i -g pnpm@10.15.0
ENV HOME=/tmp \
    PNPM_HOME=/tmp/pnpm \
    npm_config_store_dir=/app/.pnpm-store \
    NEXT_TELEMETRY_DISABLED=1 \
    TURBO_TELEMETRY_DISABLED=1
WORKDIR /app
