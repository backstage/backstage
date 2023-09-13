---
'@backstage/plugin-scaffolder': patch
---

Removed redundant `OwnedEntityPicker` schema, now referencing `EntityPicker` schema. `OwnerEntityPicker` will now pass through updated `uiSchema` to child `EntityPicker` component.
