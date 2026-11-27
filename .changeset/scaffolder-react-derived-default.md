---
'@backstage/plugin-scaffolder-react': minor
---

Added support for `ui:backstage.default` on template parameter fields so a field's default value can be derived from other parameters using Nunjitsu expressions. Derived defaults update automatically when source fields change until the user edits the target field.
