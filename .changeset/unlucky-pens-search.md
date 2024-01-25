---
'@backstage/plugin-scaffolder-backend': patch
---

When using node 20+ the `scaffolder-backend` will now throw an error at startup if the `--no-node-snapshot` option was
not provided to node.
