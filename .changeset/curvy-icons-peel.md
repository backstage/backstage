---
'@backstage/plugin-badges-backend': patch
---

Updating the `authorization` middleware to call the Catalog to check that the requesting user has permission to see the Entity before generating the UUID.
