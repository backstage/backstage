---
'@backstage/techdocs-common': patch
'@backstage/plugin-catalog': patch
'@backstage/plugin-catalog-react': patch
'@backstage/plugin-techdocs': patch
---

Adds support for referencing techdocs owned by another entity using the `backstage/techdocs-ref`
annotation. This adds a new well known prefix `catalog:` which is used as a pointer to another
existing entity ref that has techdocs associated with it.

For example another entity (e.g. domain) reference an existing documentation component entity:

```yaml
kind: Domain
metadata:
  name: playback
  annotations:
    # Usage kstage.io/techdocs-ref: `catalog:{entityRef}`
    backstage.io/techdocs-ref: catalog:component:playback-domain-docs
```
