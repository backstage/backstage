---
'@backstage/plugin-catalog-backend': patch
---

This release enables the new catalog processing engine which is a major milestone for the catalog!

This update makes processing more scalable across multiple instances, adds support for deletions and ui flagging of entities that are no longer referenced by a location.

As this is a major internal change we have taken some precaution by offering a `LEGACY_CATALOG=1` environment variable that you can set when starting the backend in order to run the previous version. If you do so for any reason make sure to raise an issue immediately as this is a temporary "break the glass" option which will be removed in a subsequent release.
