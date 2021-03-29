---
'@backstage/catalog-model': patch
'@backstage/plugin-catalog-backend': patch
'@backstage/plugin-catalog': patch
---

Implemented missing support for the dependsOn/dependencyOf relationships
between `Component` and `Resource` catalog model objects.

Added support for generating the relevant relationships to the
`BuiltinKindsEntityProcessor`, and added simple support for fetching
relationships between `Components` and `Resources` for rendering in the
system diagram. All catalog-model changes backwards compatible.
