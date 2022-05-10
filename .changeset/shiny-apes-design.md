---
'@backstage/plugin-catalog-backend': patch
---

Updated parseEntityTransformParams to handle keys with '.' in them. This will allow for querying of entities based off annotations such as 'backstage.io/orgin-location' or other entity field keys that have '.' in them.
