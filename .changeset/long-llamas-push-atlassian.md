---
'@backstage/plugin-auth-backend-module-atlassian-provider': minor
---

**BREAKING**: The `scope` and `scopes` config options have been removed and replaced by the standard `additionalScopes` config. In addition, the `offline_access`, `read:jira-work`, and `read:jira-user` scopes have been set to required and will always be present.
