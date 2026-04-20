# This dockerfile builds an image for the backend package.
# It should be executed with the root of the repo as docker context.
#
# Before building this image, be sure to have run the following commands in the repo root:
#
# yarn install
# yarn tsc
# yarn build:backend
#
# Once the commands have been run, you can build the image using `yarn build-image`

FROM node:24-trixie-slim

# Install sqlite3 dependencies. You can skip this if you don't use sqlite3 in the image,
# in which case you should also move better-sqlite3 to "devDependencies" in package.json.
# Additionally, we install dependencies for `techdocs.generator.runIn: local`.
# https://backstage.io/docs/features/techdocs/getting-started#disabling-docker-in-docker-situation-optional
RUN apt-get update && \
    apt-get install -y --no-install-recommends libsqlite3-dev python3 python3-pip python3-venv build-essential && \
    rm -rf /var/lib/apt/lists/*

# Set up a virtual environment for mkdocs-techdocs-core.
ENV VIRTUAL_ENV=/opt/venv
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

RUN pip3 install mkdocs-techdocs-core==1.1.7 mkdocs-mermaid2-plugin

# Persistent storage directory for SQLite and TechDocs cache
RUN mkdir -p /data && chown node:node /data

# From here on we use the least-privileged `node` user to run the backend.
WORKDIR /app
RUN chown node:node /app
USER node

# This switches many Node.js dependencies to production mode.
ENV NODE_ENV=production

# Copy over Yarn 4 configuration, release, and plugins
COPY --chown=node:node .yarn ./.yarn
COPY --chown=node:node .yarnrc.yml ./

# Copy repo skeleton first, to avoid unnecessary docker cache invalidation.
# The skeleton contains the package.json of each package in the monorepo,
# and along with yarn.lock and the root package.json, that's enough to run yarn install.
COPY --chown=node:node yarn.lock package.json packages/backend/dist/skeleton.tar.gz ./
RUN tar xzf skeleton.tar.gz && rm skeleton.tar.gz

# Disable global cache for Docker builds — use local project cache instead
RUN YARN_ENABLE_GLOBAL_CACHE=false yarn workspaces focus --all --production

# Install better-sqlite3 native module explicitly (transitive dep gets pruned by workspace focus)
RUN mkdir -p /tmp/sqlite3 && cd /tmp/sqlite3 && npm init -y && npm install better-sqlite3@11.10.0 && cp -r node_modules/better-sqlite3 /app/node_modules/ && cp -r node_modules/bindings /app/node_modules/ 2>/dev/null; cp -r node_modules/file-uri-to-path /app/node_modules/ 2>/dev/null; cp -r node_modules/prebuild-install /app/node_modules/ 2>/dev/null; cp -r node_modules/node-addon-api /app/node_modules/ 2>/dev/null; rm -rf /tmp/sqlite3

# Then copy the rest of the backend bundle, along with any other files we might want.
COPY --chown=node:node packages/backend/dist/bundle.tar.gz app-config*.yaml ./
COPY --chown=node:node packages/app/app-config.yaml ./packages/app/app-config.yaml
COPY --chown=node:node catalog-blitzy-sandbox.yaml ./
RUN tar xzf bundle.tar.gz && rm bundle.tar.gz

WORKDIR /app/packages/backend
CMD ["node", ".", "--config", "../../app-config.yaml", "--config", "../../app-config.production.yaml", "--config", "../app/app-config.yaml"]
