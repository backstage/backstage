---
'@backstage/config-loader': patch
---

Removed workaround for breaking change in typescript 4.3 and bump `typescript-json-schema` instead. This should again allow the usage of `@items.visibility <value>` to set the visibility of array items.
