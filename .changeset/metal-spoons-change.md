---
'@backstage/create-app': patch
---

Updated docker build to use `backstage-cli backend:bundle` instead of `backstage-cli backend:build-image`.

To apply this change to an existing application, change the following in `packages/backend/package.json`:

```diff
-  "build": "backstage-cli backend:build",
-  "build-image": "backstage-cli backend:build-image --build --tag backstage",
+  "build": "backstage-cli backend:bundle",
+  "build-image": "docker build ../.. -f Dockerfile --tag backstage",
```

Note that the backend build is switched to `backend:bundle`, and the `build-image` script simply calls `docker build`. This means the `build-image` script no longer builds all packages, so you have to run `yarn build` in the root first.

In order to work with the new build method, the `Dockerfile` at `packages/backend/Dockerfile` has been updated with the following contents:

```dockerfile
# This dockerfile builds an image for the backend package.
# It should be executed with the root of the repo as docker context.
#
# Before building this image, be sure to have run the following commands in the repo root:
#
# yarn install
# yarn tsc
# yarn build
#
# Once the commands have been run, you can build the image using `yarn build-image`

FROM node:14-buster-slim

WORKDIR /app

# Copy repo skeleton first, to avoid unnecessary docker cache invalidation.
# The skeleton contains the package.json of each package in the monorepo,
# and along with yarn.lock and the root package.json, that's enough to run yarn install.
ADD yarn.lock package.json packages/backend/dist/skeleton.tar.gz ./

RUN yarn install --frozen-lockfile --production --network-timeout 300000 && rm -rf "$(yarn cache dir)"

# Then copy the rest of the backend bundle, along with any other files we might want.
ADD packages/backend/dist/bundle.tar.gz app-config.yaml ./

CMD ["node", "packages/backend", "--config", "app-config.yaml"]
```

Note that the base image has been switched from `node:14-buster` to `node:14-buster-slim`, significantly reducing the image size. This is enabled by the removal of the `nodegit` dependency, so if you are still using this in your project you will have to stick with the `node:14-buster` base image.

A `.dockerignore` file has been added to the root of the repo as well, in order to keep the docker context upload small. It lives in the root of the repo with the following contents:

```gitignore
.git
node_modules
packages
!packages/backend/dist
plugins
```
