---
'@backstage/plugin-scaffolder': patch
---

The template wizard now reads form decorators from the new
`spec.formDecorators` field on a template, falling back to the deprecated
`spec.EXPERIMENTAL_formDecorators` for templates that have not been migrated.
