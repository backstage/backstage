---
'@backstage/integration': patch
'@backstage/plugin-catalog-backend-module-aws': patch
'@backstage/plugin-catalog-backend-module-gerrit': patch
'@backstage/plugin-stack-overflow-backend': patch
'@backstage/plugin-techdocs-backend': patch
---

Remove explicit default visibility at `config.d.ts` files.

```ts
/**
 * @visibility backend
 */
```
