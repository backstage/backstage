---
'@backstage/catalog-model': patch
'@backstage/plugin-catalog-backend': patch
---

Adds a `backstage.io/managed-by-origin-location` annotation to all entities. It links to the
location that was registered to the catalog and which emitted this entity. It has a different
semantic than the existing `backstage.io/managed-by-location` annotation, which tells the direct
parent location that created this entity.

Consider this example: The Backstage operator adds a location of type `github-org` in the
`app-config.yaml`. This setting will be added to a `bootstrap:boostrap` location. The processor
discovers the entities in the following branch
`Location bootstrap:bootstrap -> Location github-org:… -> User xyz`. The user `xyz` will be:

```yaml
apiVersion: backstage.io/v1alpha1
kind: User
metadata:
  name: xyz
  annotations:
    # This entity was added by the 'github-org:…' location
    backstage.io/managed-by-location: github-org:…
    # The entity was added because the 'bootstrap:boostrap' was added to the catalog
    backstage.io/managed-by-origin-location: bootstrap:bootstrap
    # ...
spec:
  # ...
```
