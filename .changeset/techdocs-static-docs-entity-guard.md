---
'@backstage/plugin-techdocs-backend': patch
---

Fixed the entity check on documentation asset requests being skipped for paths that do not contain a well-formed entity triplet, which could let such a request reach storage unchecked. Those requests are now rejected.
