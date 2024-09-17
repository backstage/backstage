---
'@backstage/plugin-catalog-backend-module-gitlab': patch
---

Added a `includeUsersWithoutSeat` config option that allow import of users without a paid seat, e.g. for Gitlab Free on SaaS. Defaults to false
