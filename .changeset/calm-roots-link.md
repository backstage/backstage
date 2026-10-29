---
'@backstage/plugin-app-backend': patch
---

Documented that if your package manager doesn't hoist workspace packages, for example pnpm with `hoistWorkspacePackages: false`, you need to add the app package to the `dependencies` of the root `package.json`.
