---
'@backstage/plugin-scaffolder-backend': patch
---

Scaffolder: Added an 'notEq' handlebars helper for use in software template YAML files. This can be used to execute a step depending on the value of an input, e.g.:

```yaml
steps:
  id: 'conditional-step'
  action: 'custom-action'
  if: '{{ notEq parameters.myvalue "custom" }}',
```
