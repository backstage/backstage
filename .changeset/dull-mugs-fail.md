---
'@backstage/plugin-catalog-backend-module-gerrit': patch
---

Allow to specify a custom `catalogPath` in the `catalog.providers.gerrit` configuration.

If not set, it defaults to `catalog-info.yaml` files at the root of repositories. This default was the value before this change.

With the changes in the `GerritUrlReader`, `catalogPath` also allows to use `minimatch`'s glob-patterns.

```diff
catalog:
  providers:
    gerrit:
      all: # identifies your dataset / provider independent of config changes
        host: gerrit.company.com
        query: 'state=ACTIVE&type=CODE'
+       # This will search for catalog manifests anywhere in the repositories
+       catalogPath: '**/catalog-info.{yml,yaml}'
```
