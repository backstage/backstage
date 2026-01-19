---
'@backstage/plugin-catalog-backend-module-github': patch
---

Improved efficiency of `GithubOrgEntityProvider` membership event handling and edit team. The provider now fetches only the specific user's teams instead of all organization users when processing membership events, and uses `addEntitiesOperation` instead of `replaceEntitiesOperation` to avoid unnecessary entity deletions.
