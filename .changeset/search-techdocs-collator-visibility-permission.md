---
'@backstage/plugin-search-backend-module-techdocs': patch
---

Indexed documentation is now filtered using the `techdocs.entity.read` permission when the new `techdocs.experimentalTechdocsPermissions` flag is enabled, so documentation that a user is not allowed to read no longer appears in their search results. Without the flag, results continue to be filtered using `catalog.entity.read` as before.

Search results are filtered when a query is made rather than when documents are indexed, so there is no need to rebuild the search index when changing the flag.
