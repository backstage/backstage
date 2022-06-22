---
'@backstage/plugin-catalog-backend-module-gitlab': patch
---

Add the possibility in the `GitlabDiscoveryEntityProvider` to scan the whole project instead of concrete groups. For that, use a configuration like this one, where the group parameter is omitted (not mandatory anymore):

```yaml
catalog:
  providers:
    gitlab:
      yourProviderId:
        host: gitlab-host # Identifies one of the hosts set up in the integrations
        branch: main # Optional. Uses `master` as default
        entityFilename: catalog-info.yaml # Optional. Defaults to `catalog-info.yaml`
```
