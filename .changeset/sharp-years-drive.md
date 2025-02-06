---
'@backstage/plugin-search-backend-module-catalog': patch
---

Modified the logic for generating the location URL by encoding the entity property values with `encodeURIComponent`. This enhancement improves the safety and reliability of the URL.
