---
'@backstage/create-app': patch
---

Optimized the command order in `packages/backend/Dockerfile` as well as added the `--no-install-recommends` to the `apt-get install` and tweaked the installed packages.

To apply this change to an existing app, update your `packages/backend/Dockerfile` to match the documented `Dockerfile` at https://backstage.io/docs/deployment/docker#host-build.
