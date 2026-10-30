---
'@backstage/backend-plugin-api': minor
---

The `coreServices` export is now a frozen plain object instead of a TypeScript namespace, and its type is described by the new `CoreServices` interface. Usage is unchanged, and every service reference keeps its existing type. The object can no longer be modified at runtime.
