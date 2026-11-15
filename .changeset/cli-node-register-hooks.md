---
'@backstage/cli-node': patch
---

The Node.js module transform now uses the synchronous `module.registerHooks()` API when it is available, which avoids the `module.register()` deprecation warning printed by Node.js 26. On older Node.js versions it continues to use `module.register()`.
