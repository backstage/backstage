---
'@backstage/plugin-techdocs': minor
'@backstage/plugin-techdocs-backend': minor
'@backstage/techdocs-common': minor
---

TechDocs sites can now be accessed using paths containing entity triplets of
any case (e.g. `/docs/namespace/KIND/name` or `/docs/namespace/kind/name`).

If you do not use an external storage provider for serving TechDocs, this is a
transparent change and no action is required from you.

If you _do_ use an external storage provider for serving TechDocs (e.g. Google
Cloud Storage, AWS S3, or Azure Blob Storage), you must run a migration command
against your storage provider before updating to this version.

[A migration guide is available here](#todo).

This is the third and final step of migrating cloud storage entities to lowercase ([see](https://github.com/backstage/backstage/issues/4367#issuecomment-876461002)).
