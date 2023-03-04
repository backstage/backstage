---
'@backstage/plugin-scaffolder': patch
---

Allow use of `true` value inside filters to filter entities that has that key.

this example will filter all entities that has the annotation `someAnnotation` set to any value.

```yaml
ui:options:
  catalogFilter:
    kind: Group
    metadata.annotations.github.com/team-slug: true
```
