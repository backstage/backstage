---
'@backstage/plugin-catalog-backend-module-msgraph': patch
---

Fixed a bug where setting `user.select` to an empty array would cause all users to be dropped from the catalog instead of using the default set of fields.
