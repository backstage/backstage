---
'@backstage/plugin-scaffolder-node': minor
'@backstage/plugin-scaffolder-node-test-utils': patch
---

Added `ctx.registerSensitiveValue` to template action contexts and their test utilities. Custom actions can use it to protect credentials and other sensitive values that they create or discover during execution.
