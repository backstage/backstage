---
'@backstage/catalog-model': minor
---

**BREAKING**: The User kind has an updated TypeScript type where `spec.memberOf`
is optional.

**NOTE HOWEVER**, that this only applies to the TypeScript types `UserEntity`
and `UserEntityV1alpha1`. The catalog validation still requires the field to be
set, even if it's in the form of an empty array. If you try to ingest data that
stops producing this field, those entities _will be rejected_ by the catalog.
The reason for these choices is that consumers will get a long grace period
where old code still can rely on the underlying data being present, giving users
ample time to update before actual breakages could happen.
