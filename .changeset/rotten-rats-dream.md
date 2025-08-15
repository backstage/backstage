---
'@backstage/plugin-scaffolder-backend-module-github': patch
---

Fixed bug in the `customProperties` type which was preventing it being used to set a list of values against a key (e.g. for multi-select fields)
