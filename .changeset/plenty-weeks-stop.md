---
'@backstage/cli-module-build': patch
---

Suppressed false-positive Module Federation warning for shared dependencies that use secondary entry points (e.g. `@mui/material/styles`). These sub-path `package.json` files lack a `version` field, causing the bundler to emit "No version specified" warnings that fail CI builds.
