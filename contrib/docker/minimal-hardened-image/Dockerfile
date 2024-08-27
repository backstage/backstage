# This dockerfile builds an image for the backend package.
# It should be executed with the root of the repo as docker context.
#
# Before building this image, be sure to have run the following commands in the repo root:
#
# yarn install
# yarn tsc
# yarn build:backend
#
# Once the commands have been run, you can build the image using `yarn docker-build`

# syntax = docker/dockerfile:1.4

# Build Python environment in a separate builder stage
FROM cgr.dev/chainguard/python:latest-dev as python-builder

ENV PATH=/venv/bin:$PATH

RUN --mount=type=cache,target=/home/nonroot/.cache/pip,uid=65532,gid=65532 \
    python3 -m venv /home/nonroot/venv && \
    /home/nonroot/venv/bin/pip install mkdocs-techdocs-core==1.3.3

# Build Node environment in a separate builder stage
FROM cgr.dev/chainguard/wolfi-base:latest as node-builder

ENV NODE_VERSION="20=~20.11"
ENV NODE_ENV=production

RUN --mount=type=cache,target=/var/cache/apk,sharing=locked,uid=65532,gid=65532 \
    --mount=type=cache,target=/var/lib/apk,sharing=locked,uid=65532,gid=65532 \
    apk update && \
    apk add nodejs-$NODE_VERSION yarn \
    # Install isolate-vm dependencies, these are needed by the @backstage/plugin-scaffolder-backend.
    openssl-dev brotli-dev c-ares-dev nghttp2-dev icu-dev zlib-dev gcc-12 libuv-dev build-base

WORKDIR /app
RUN chown -R nonroot:nonroot /app

RUN mkdir -p /home/nonroot/.yarn/berry && chown -R 65532:65532 /home/nonroot/.yarn/berry

USER nonroot

COPY --chown=65532:65532 .yarn ./.yarn
COPY --chown=65532:65532 .yarnrc.yml ./

COPY --chown=65532:65532 yarn.lock package.json packages/backend/dist/skeleton.tar.gz ./
RUN tar xzf skeleton.tar.gz && rm skeleton.tar.gz

RUN --mount=type=cache,target=/home/nonroot/.yarn/berry/cache,sharing=locked,uid=65532,gid=65532 \
    yarn workspaces focus --all --production && yarn cache clean --all

# Final stage to build the application image
FROM cgr.dev/chainguard/wolfi-base:latest

ENV PYTHON_VERSION="3.12=~3.12"
ENV NODE_VERSION="20=~20.14"
ENV NODE_ENV=production

RUN --mount=type=cache,target=/var/cache/apk,sharing=locked,uid=65532,gid=65532 \
    --mount=type=cache,target=/var/lib/apk,sharing=locked,uid=65532,gid=65532 \
    apk update && \
    apk add \
    # add node for backstage
    nodejs-$NODE_VERSION \
    # add python for backstage techdocs
    python-$PYTHON_VERSION \
    # add tini for init process
    tini

WORKDIR /app

COPY package.json app-config.yaml ./
ADD packages/backend/dist/skeleton.tar.gz packages/backend/dist/bundle.tar.gz ./

RUN chown -R 65532:65532 /app
RUN chown -R 65532:65532 /tmp
USER 65532:65532

COPY --from=node-builder --chown=65532:65532 /app/node_modules ./node_modules
COPY --from=python-builder --chown=65532:65532 /home/nonroot/venv /home/nonroot/venv
ENV PATH=/home/nonroot/venv/bin:$PATH

ENV NODE_OPTIONS="--no-node-snapshot"
ENV GIT_PYTHON_REFRESH="quiet"

ENTRYPOINT ["tini", "--"]
CMD ["node", "packages/backend", "--config", "app-config.yaml"]
