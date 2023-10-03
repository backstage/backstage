---
'@backstage/create-app': patch
---

Bump Docker base images to `node:18-bookworm-slim` to fix node compatibility issues raised during image build.

You can apply these change to your own `Dockerfile` by replacing `node:16-bullseye-slim` with `node:18-bookworm-slim`
