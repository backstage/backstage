---
'@backstage/plugin-catalog-backend-module-gitlab': minor
---

**BREAKING** The `GitlabDiscoveryEntityProvider` and `GitlabOrgDiscoveryEntityProvider` can no longer be used together with the same `provider id`. This is a **major change** which will affect database entries as well.

Both entity providers now check for `orgEnabled` configuration option, which means that if you need both providers you will have to create an additional `provider id` for either `GitlabDiscoveryEntityProvider` / `GitlabOrgDiscoveryEntityProvider` in `catalog.providers.gitlab` inside `app-config.yaml` file.
