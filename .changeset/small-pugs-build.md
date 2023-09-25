---
'@backstage/create-app': patch
---

Bump Docker base images to `node:18-bullseye-slim` to fix compatibility issues raised during image build.

You can apply these change to your own `Dockerfile` by replacing `node:16-bullseye-slim` with `node:18-bullseye-slim`
