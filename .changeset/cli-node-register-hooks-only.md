---
'@backstage/cli-node': minor
---

**BREAKING**: `@backstage/cli-node/config/nodeTransformHooks.mjs` no longer exports `resolve` and `load`. The Node.js module transform registers its hooks exclusively with `module.registerHooks()`, and loading it requires that Node.js can `require()` ES modules, which is the default. `--no-require-module` makes the transform fail to load.
