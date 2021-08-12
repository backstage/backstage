---
'@backstage/techdocs-common': patch
---

Stale TechDocs content (files that had previously been published but which have
since been removed) is now removed from storage at publish-time. This is now
supported by the following publishers:

- Google GCS
- AWS S3
- Azure Blob Storage

You may need to apply a greater level of permissions (e.g. the ability to
delete objects in your storage provider) to any credentials/accounts used by
the TechDocs CLI or TechDocs backend in order for this change to take effect.

For more details, see [#6132][issue-ref].

[issue-ref]: https://github.com/backstage/backstage/issues/6132
