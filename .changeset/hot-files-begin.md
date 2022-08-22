---
'@backstage/create-app': patch
---

The `packages/backend/Dockerfile` received a couple of updates, it now looks as follows:

```Dockerfile
FROM node:16-bullseye-slim

# Install sqlite3 dependencies. You can skip this if you don't use sqlite3 in the image,
# in which case you should also move better-sqlite3 to "devDependencies" in package.json.
RUN apt-get update && \
    apt-get install -y --no-install-recommends libsqlite3-dev python3 build-essential && \
    rm -rf /var/lib/apt/lists/* && \
    yarn config set python /usr/bin/python3

# From here on we use the least-privileged `node` user to run the backend.
USER node
WORKDIR /app

# This switches many Node.js dependencies to production mode.
ENV NODE_ENV production

# Copy repo skeleton first, to avoid unnecessary docker cache invalidation.
# The skeleton contains the package.json of each package in the monorepo,
# and along with yarn.lock and the root package.json, that's enough to run yarn install.
COPY --chown=node:node yarn.lock package.json packages/backend/dist/skeleton.tar.gz ./
RUN tar xzf skeleton.tar.gz && rm skeleton.tar.gz

RUN yarn install --frozen-lockfile --production --network-timeout 300000 && rm -rf "$(yarn cache dir)"

# Then copy the rest of the backend bundle, along with any other files we might want.
COPY --chown=node:node packages/backend/dist/bundle.tar.gz app-config*.yaml ./
RUN tar xzf bundle.tar.gz && rm bundle.tar.gz

CMD ["node", "packages/backend", "--config", "app-config.yaml", "--config", "app-config.production.yaml"]
```

The two notable changes are that a `USER node` instruction has been added and the ordering of instructions has been changed accordingly. This means that the app will now be running using the least-privileged `node` user. In order for this to work we now need to make sure that all app files are owned by the `node` user, which we do by adding the `--chown=node:node` option to the `COPY` instructions.

The second change is the addition of `ENV NODE_ENV production`, which ensured that all Node.js modules run in production mode. If you apply this change to an existing app, note that one of the more significant changes is that this switches the log formatting to use the default production format, JSON. Rather than your log lines looking like this:

```log
2022-08-10T11:36:05.478Z catalog info Performing database migration type=plugin
```

They will now look like this:

```log
{"level":"info","message":"Performing database migration","plugin":"catalog","service":"backstage","type":"plugin"}
```

If you wish to keep the existing format, you can override this change by applying the following change to `packages/backend/src/index.ts`:

```diff
   getRootLogger,
+  setRootLogger,
+  createRootLogger,
+  coloredFormat,
   useHotMemoize,
 ...
   ServerTokenManager,
 } from '@backstage/backend-common';

 ...

 async function main() {
+  setRootLogger(createRootLogger({ format: coloredFormat }));
+
   const config = await loadBackendConfig({
```
