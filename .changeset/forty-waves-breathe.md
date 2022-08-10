---
'@backstage/plugin-scaffolder': patch
---

- Fixing validation for arrays, objects and other parts of the `jsonschema` with `anyOf` and `allOf`
- Correctly handle different states for the form, so that the review step renders correctly when using `dependencies` in the templates.
