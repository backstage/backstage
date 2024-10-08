---
'@backstage/plugin-scaffolder': patch
---

Fix behavior of scaffolder entity pickers (EntityPicker, MultiEntityPicker, MyGroupsPicker) to not auto-fill and disable the field if there is only a single value option and the field is not required.
