---
'@backstage/catalog-model': patch
'@backstage/plugin-scaffolder': patch
'@backstage/plugin-scaffolder-backend': patch
---

Introduce conditional steps in scaffolder templates.

A step can now include an `if` property that only executes a step if the
condition is truthy. The condition can include handlebar templates.

```yaml
- id: register
    if: '{{ not parameters.dryRun }}'
    name: Register
    action: catalog:register
    input:
    repoContentsUrl: '{{ steps.publish.output.repoContentsUrl }}'
    catalogInfoPath: '/catalog-info.yaml'
```

Also introduces a `not` helper in handlebar templates that allows to negate
boolean expressions.
