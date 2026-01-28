---
'@backstage/plugin-scaffolder': patch
---

Scaffolder form fields in the new frontend system now use a Utility API pattern instead of multiple attachment points. The `FormFieldBlueprint` now uses this new approach, and while form fields created with older versions still work, they will produce a deprecation warning and will stop working in a future release.

As part of this change, the following alpha exports were removed:

- `formFieldsApiRef`
- `ScaffolderFormFieldsApi`
