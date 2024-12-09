---
'@backstage/plugin-scaffolder-react': patch
'@backstage/plugin-scaffolder': patch
---

Scaffolder field extensions registered with `FormFieldBlueprint` are now collected in the `useCustomFieldExtensions` hook, enabling them for use in the scaffolder.
