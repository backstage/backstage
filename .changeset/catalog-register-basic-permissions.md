---
'@backstage/plugin-catalog-backend': patch
---

The catalog backend now registers all of its permissions with the permissions registry, including basic (non-resource) permissions such as the location permissions. This makes them discoverable through the permissions metadata and allows them to be enforced through the catalog's OpenAPI router.
