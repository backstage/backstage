---
'@backstage/plugin-scaffolder': patch
---

Allow defining custom option label for `EntityPicker`

This allows passing a custom schema to be used for entity picker options for example:

```yaml
entity:
  title: My Entity
  type: string
  ui:field: EntityPicker
  ui:options:
    allowArbitraryValues: false
    optionLabelSchema: @{{metadata.title}} (@{{metadata.name}})
```

This does not work if `allowArbitraryValues` is set to `true`.
