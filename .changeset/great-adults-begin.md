---
'@backstage/plugin-catalog-backend-module-openapi': patch
---

Add support for the new backend system.

A new backend module for the catalog backend
was added and exported as `default`.

You can use it with the new backend system like

```ts title="packages/backend/src/index.ts"
backend.add(import('@backstage/plugin-catalog-backend-module-openapi'));
```
