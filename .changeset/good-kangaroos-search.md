---
'@backstage/plugin-catalog-backend-module-system-entity-model': minor
---

The implementation of the default entity model (the builtin kinds) is now moved
to the this package. The old `BuiltinKindsEntityProcessor` is renamed to
`SystemEntityModelProcessor`, but functions the same.

There is also a new `catalogModuleSystemEntityModel` module that enables these
default kinds in installations using the new backend system.
