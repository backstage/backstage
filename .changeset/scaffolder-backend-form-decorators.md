---
'@backstage/plugin-scaffolder-backend': minor
---

The template parameter schema response now includes a `formDecorators`
field, populated from `spec.formDecorators` or, if unset, the deprecated
`spec.EXPERIMENTAL_formDecorators`. The legacy `EXPERIMENTAL_formDecorators`
field continues to be returned for backward compatibility.
