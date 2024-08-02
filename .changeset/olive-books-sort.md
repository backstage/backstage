---
'@backstage/plugin-permission-node': patch
---

The MetadataResponseSerializedRule type has been moved to @backstage/plugin-permission-common, and should be imported from there going forward. To avoid an immediate breaking change, this type is still re-exported from this package, but is marked as deprecated and will be removed in a future release.
