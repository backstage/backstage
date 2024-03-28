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

FROM cgr.dev/chainguard/wolfi-base:latest

ENV NODE_VERSION 18=~18.19
ENV PYTHON_VERSION 3.12=~3.12

RUN apk add nodejs-$NODE_VERSION yarn

# Install sqlite3 dependencies. You can skip this if you don't use sqlite3 in the image,
# in which case you should also move better-sqlite3 to "devDependencies" in package.json.
# Additionally, we install dependencies for `techdocs.generator.runIn: local`.
# https://backstage.io/docs/features/techdocs/getting-started#disabling-docker-in-docker-situation-optional
RUN --mount=type=cache,target=/var/cache/apk,sharing=locked \
    --mount=type=cache,target=/var/lib/apk,sharing=locked \
    apk update && \
    apk add sqlite-dev python-$PYTHON_VERSION py3-pip python-3-dev py3-setuptools build-base gcc libffi-dev glibc-dev openssl-dev brotli-dev c-ares-dev nghttp2-dev icu-dev zlib-dev gcc-12 libuv-dev && \
    yarn config set python /usr/bin/python3

# Set up a virtual environment for mkdocs-techdocs-core.
ENV VIRTUAL_ENV=/opt/venv
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

RUN pip3 install mkdocs-techdocs-core==1.3.3

# From here on we use the least-privileged `node` user to run the backend.
WORKDIR /app
RUN chown nonroot:nonroot /app
USER nonroot

# This switches many Node.js dependencies to production mode.
ENV NODE_ENV production

# Copy over Yarn 3 configuration, release, and plugins
COPY --chown=nonroot:nonroot .yarn ./.yarn
COPY --chown=nonroot:nonroot .yarnrc.yml ./

# Copy repo skeleton first, to avoid unnecessary docker cache invalidation.
# The skeleton contains the package.json of each package in the monorepo,
# and along with yarn.lock and the root package.json, that's enough to run yarn install.
COPY --chown=nonroot:nonroot yarn.lock package.json packages/backend/dist/skeleton.tar.gz ./
RUN tar xzf skeleton.tar.gz && rm skeleton.tar.gz

RUN --mount=type=cache,target=/home/node/.yarn/berry/cache,sharing=locked,uid=1000,gid=1000 \
    yarn workspaces focus --all --production

# Then copy the rest of the backend bundle, along with any other files we might want.
COPY --chown=nonroot:nonroot packages/backend/dist/bundle.tar.gz app-config*.yaml ./
RUN tar xzf bundle.tar.gz && rm bundle.tar.gz

CMD ["node", "packages/backend", "--config", "app-config.yaml"]
