---
'@backstage/cli': minor
---

**BREAKING**: Removed `@backstage/cli/config/nodeTransformHooks.mjs`. Load `@backstage/cli-node/config/nodeTransform.cjs` instead of registering that file with `module.register()`.
