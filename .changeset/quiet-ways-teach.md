---
'@backstage/plugin-scaffolder': patch
---

Added nunjucks templates support for `EntityPicker` `catalogFilter` `ui:options` property.

This change will allow to use values of another parameters to restrict results of `EntityPicker` dropdowns, for example

```
parameters:
  - title: Service Settings
    properties:
      system:
        title: System
        type: string
        ui:field: EntityPicker
        ui:options:
          catalogFilter:
            - kind: Domain
          defaultKind: Domain
          allowArbitraryValues: false
      product:
        title: Product
        type: string
        ui:field: EntityPicker
        ui:options:
          catalogFilter:
            - kind: System
              spec.domain: '{{ parameters.system }}'
          defaultKind: System
          allowArbitraryValues: false
```
