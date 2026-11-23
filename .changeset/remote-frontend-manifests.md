---
'@backstage/backend-dynamic-feature-service': patch
---

Each item of the `/remotes` endpoint now has an optional `frontendManifest` field, which is read from the `frontend` section of the `backstage-manifest.json` file next to the module federation manifest of the remote. It describes the plugins of the remote so that an app can defer loading them. Remotes without the file are served as before.
