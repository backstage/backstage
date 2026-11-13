---
'@backstage/plugin-techdocs-backend': patch
---

Fixed the entity check on documentation asset requests being skipped for paths that do not contain a well-formed entity triplet, and for paths using encoded separators, either of which could let such a request reach another entity's documentation. Those requests are now rejected.
