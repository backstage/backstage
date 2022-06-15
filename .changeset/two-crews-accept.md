---
'@backstage/plugin-catalog-backend-module-gitlab': minor
---

Add the possibility in the `GitlabDiscoveryEntityProvider` to scan the whole project instead of concrete groups. For that, use a configuration like this one:

```yaml
catalog:
  providers:
    gitlab:
      host: gitlab-host # Identifies one of the hosts set up in the integrations
      branch: main # Optional. Uses `master` as default
      entityFilename: catalog-info.yaml # Optional. Defaults to `catalog-info.yaml`
```
