---
'@backstage/plugin-catalog-react': patch
---

Fixed an issue where the `<EntityListProvider />` in `offset` mode would unnecessarily re-fetch data when the filter didn't change, causing a flicker effect.
