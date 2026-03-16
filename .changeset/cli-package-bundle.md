---
'@backstage/cli-module-build': minor
---

Added `package bundle` command to create self-contained plugin bundles for dynamic loading, to be used by the `backend-dynamic-feature-service`. Supports backend and frontend plugins, with optional `--pre-packed-dir` for batch bundling from a pre-built workspace.
