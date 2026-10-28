---
'@backstage/core-plugin-api': patch
'@backstage/core-compat-api': patch
---

Preserved legacy app icon component lookups when using the element-based `IconsApi`. Existing consumers can continue to use `getSystemIcon` and `getSystemIcons`.
