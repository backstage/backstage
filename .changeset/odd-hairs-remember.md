---
'@backstage/catalog-client': minor
---

**BREAKING**: Removed the deprecated `presence` field in the `Location` and `AddLocationRequest` types. This field was already being ignored by the catalog backend and can be safely removed.
