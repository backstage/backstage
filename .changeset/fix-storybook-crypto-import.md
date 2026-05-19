---
'@backstage/plugin-catalog-backend': patch
---

Moved `generateStableHash` out of shared utility file to avoid pulling `node:crypto` into browser bundles
