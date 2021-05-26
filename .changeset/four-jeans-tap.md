---
'@backstage/config-loader': patch
---

Resolve the path to app-config.yaml from the current working directory. This will allow use of `yarn link` or running the CLI in other directories and improve the experience for local backstage development.
