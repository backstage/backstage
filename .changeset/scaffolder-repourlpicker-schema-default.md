---
'@backstage/plugin-scaffolder': patch
---

Fixed `RepoUrlPicker` not initializing from `schema.default` when `formData` is undefined, which caused hidden required sub-inputs (`owner`, `repo`) to remain empty and block the Next button when the field is inside a nested `dependencies/oneOf` branch.
