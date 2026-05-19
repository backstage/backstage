---
'@backstage/plugin-scaffolder': patch
---

Form decorator input is now parsed against the zod schema configured on the
decorator before the decorator runs, so defaults declared via `.default()`
are applied and invalid input is reported through the error API instead of
silently passing through.
