# This dockerfile builds an image for the backend package.
# It should be executed with the root of the repo as docker context.
#
# Before building this image, be sure to have run the following commands in the repo root:
#
# yarn install --immutable
# yarn tsc
# yarn build:backend
#
# Once the commands have been run, you can build the image using:
#
# docker build . -f contrib/docker/minimal-hardened-image/Dockerfile

ARG NODE_VERSION=24
ARG PYTHON_VERSION=3.13

# Build Python environment for TechDocs in a separate builder stage
# NOTE: latest-dev tracks the current Chainguard Python version
FROM cgr.dev/chainguard/python:latest-dev AS python-builder

RUN --mount=type=cache,target=/home/nonroot/.cache/pip,uid=65532,gid=65532 \
    python3 -m venv /home/nonroot/venv && \
    /home/nonroot/venv/bin/pip install mkdocs-techdocs-core==1.6.1

# Build Node environment in a separate builder stage
FROM cgr.dev/chainguard/wolfi-base:latest AS node-builder

ARG NODE_VERSION
ENV NODE_ENV=production

RUN --mount=type=cache,target=/var/cache/apk,sharing=locked \
    --mount=type=cache,target=/var/lib/apk,sharing=locked \
    apk update && \
    apk add \
    nodejs-${NODE_VERSION} \
    yarn-berry \
    # isolate-vm dependencies needed by @backstage/plugin-scaffolder-backend
    build-base \
    openssl-dev \
    brotli-dev \
    c-ares-dev \
    nghttp2-dev \
    icu-dev \
    zlib-dev \
    libuv-dev

WORKDIR /app
RUN chown -R nonroot:nonroot /app && \
    mkdir -p /home/nonroot/.yarn/berry && chown -R 65532:65532 /home/nonroot/.yarn/berry

USER nonroot

COPY --chown=65532:65532 .yarn ./.yarn
COPY --chown=65532:65532 .yarnrc.yml ./

COPY --chown=65532:65532 yarn.lock package.json packages/backend/dist/skeleton.tar.gz ./
RUN tar xzf skeleton.tar.gz && rm skeleton.tar.gz

RUN --mount=type=cache,target=/home/nonroot/.yarn/berry/cache,sharing=locked,uid=65532,gid=65532 \
    yarn workspaces focus --all --production && yarn cache clean --all

# Final stage to build the application image
FROM cgr.dev/chainguard/wolfi-base:latest

ARG NODE_VERSION
ARG PYTHON_VERSION
ENV NODE_ENV=production

RUN --mount=type=cache,target=/var/cache/apk,sharing=locked \
    --mount=type=cache,target=/var/lib/apk,sharing=locked \
    apk update && \
    apk add \
    # add node for backstage
    nodejs-${NODE_VERSION} \
    # add python for backstage TechDocs
    python-${PYTHON_VERSION} \
    # add tini for init process
    tini

WORKDIR /app

COPY --chown=65532:65532 package.json app-config.yaml ./
ADD --chown=65532:65532 packages/backend/dist/skeleton.tar.gz packages/backend/dist/bundle.tar.gz ./

COPY --from=node-builder --chown=65532:65532 /app/node_modules ./node_modules
COPY --from=python-builder --chown=65532:65532 /home/nonroot/venv /home/nonroot/venv

RUN chown -R 65532:65532 /app /tmp

ENV PATH=/home/nonroot/venv/bin:$PATH
ENV NODE_OPTIONS="--no-node-snapshot"
ENV GIT_PYTHON_REFRESH="quiet"

USER 65532:65532

ENTRYPOINT ["tini", "--"]
CMD ["node", "packages/backend", "--config", "app-config.yaml"]
