---
'@backstage/create-app': patch
---

Change base node image from node:18-bullseye-slim to node:18-bookworm-slim due to Docker build error on bullseye.

You can apply these change to your own `Dockerfile` by replacing `node:18-bullseye-slim` with `node:18-bookworm-slim`
