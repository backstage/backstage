---
'@backstage/plugin-scaffolder-backend': minor
---

The template parameter schema response now exposes a `formDecorators` field
instead of `EXPERIMENTAL_formDecorators`. Templates that still declare
`spec.EXPERIMENTAL_formDecorators` are read transparently and surfaced under
the new field.
