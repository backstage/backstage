---
'@backstage/plugin-scaffolder': patch
---

Fixed a crash in `EntityPicker` and `MultiEntityPicker` where a `null` value in a `catalogFilter` property (e.g. from malformed YAML templates) would cause a `TypeError: Cannot read properties of null (reading 'exists')`. Invalid filter values are now defensively ignored. Also consolidated duplicated catalog filter conversion logic into a shared utility.
