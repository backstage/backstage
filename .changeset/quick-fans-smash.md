---
'@backstage/plugin-search-backend-module-elasticsearch': patch
---

Fix to allow optionally reading `auth` parameter for custom hosted ElasticSearch instances. Also remove `bearer` auth config since it's currently unsupported.
