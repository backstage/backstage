---
'@backstage/catalog-model': minor
---

**BREAKING**: Simplified the `parseEntityRef` function to _always_ either return
a complete `EntityName`, complete with both kind, namespace and name, or throw
an error if it for some reason did not have enough information to form that
result. This makes its usage and its type declaration vastly simpler.
