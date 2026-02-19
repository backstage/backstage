---
'@backstage/plugin-scaffolder': patch
---

Added a new `ui:autoSelect` option to the EntityPicker field that controls whether an entity is automatically selected when the field loses focus. When set to `false`, the field will remain empty if the user closes it without explicitly selecting an entity, preventing unintentional selections. Defaults to `true` for backward compatibility.
