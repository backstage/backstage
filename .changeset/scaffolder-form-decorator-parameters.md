---
'@backstage/plugin-scaffolder-react': minor
'@backstage/plugin-scaffolder': minor
---

Form decorators now receive the template's parameter schemas via a new `parameters` property on the decorator context. The value is the array of parameter step schemas as written in the template's `spec.parameters`, allowing decorators to inspect the form's structure when deciding how to mutate state or secrets.
