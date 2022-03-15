---
'@backstage/config-loader': patch
---

The `typescript-json-schema` dependency that is used during schema collection is now lazy loaded, as it eagerly loads in the TypeScript compiler.
