---
'@backstage/plugin-catalog-backend-module-gitlab': patch
---

Add the `relations` array to allow Backstage to mirror GitLab's membership behavior, including descendant, inherited, and shared-from-group memberships.

The previous `allowInherited` config option will be deprecated in future versions. Use the `relations` array with the `INHERITED` option instead.

```yaml
catalog:
  providers:
    gitlab:
      development:
        relations:
          - INHERITED
```
