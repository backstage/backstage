---
'@backstage/plugin-catalog-backend-module-gitlab': patch
---

Fix Gitlab.com user ingestion by scoping GitlabOrgDiscoveryEntityProvider to a group.

**BREAKING** The `group` parameter is now required Gitlab.com Org Data integrations and the backend will fail to start without this option configured.

```diff
catalog:
  providers:
    gitlab:
      yourProviderId:
        host: gitlab.com
        orgEnabled: true
+       group: org/teams
```
