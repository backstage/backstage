---
'@backstage/plugin-techdocs': minor
'@backstage/plugin-techdocs-backend': minor
'@backstage/techdocs-common': minor
---

TechDocs sites can now be accessed using paths containing entity triplets of
any case (e.g. `/docs/namespace/KIND/name` or `/docs/namespace/kind/name`).

If you do not use an external storage provider for serving TechDocs, this is a
transparent change and no action is required from you.

If you _do_ use an external storage provider for serving TechDocs (one of\* GCS,
AWS S3, or Azure Blob Storage), you must run a migration command against your
storage provider before updating.

[A migration guide is available here](https://backstage.io/docs/features/techdocs/how-to-guides#how-to-migrate-from-techdocs-alpha-to-beta).

- (\*) We're seeking help from the community to bring OpenStack Swift support
  [to feature parity](https://github.com/backstage/backstage/issues/6763) with the above.
