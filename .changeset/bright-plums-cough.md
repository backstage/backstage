---
'@backstage/backend-plugin-api': minor
---

**BREAKING**: Split out the hook for both lifecycle services so that the first parameter of `addShutdownHook` is the hook function, and the second is the options.
