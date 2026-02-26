---
'@backstage/plugin-catalog-react': patch
---

Fixes a bug where the `EntityListProvider` would not correctly hydrate query parameters if more than 20 were provided for the same key.
