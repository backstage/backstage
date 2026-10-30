---
'@backstage/backend-plugin-api': patch
---

The `coreServices` export is now declared as a frozen plain object instead of a TypeScript namespace. Usage is unchanged, and every service reference keeps its existing type. The object can no longer be modified at runtime.
