---
'@backstage/plugin-scaffolder': patch
---

Fixed `EntityPicker` display inconsistency between dropdown options and selected value by adding an overlay with `EntityDisplayName` when an entity is selected. This preserves the entity reference as the actual value while showing a consistent formatted display in both the dropdown and input field.
