---
'@backstage/plugin-catalog-backend-module-msgraph': minor
---

Use mail prefix to identify user entities (instead of using `normalizeEntityName` helper function). It allows to be compatible with Microsoft auth provider, so that entity ownership can be identified correctly for authenticated users.
