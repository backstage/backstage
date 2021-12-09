---
'@backstage/plugin-catalog-backend': patch
---

The `pagedRequest` method in the GitLab ingestion client is now public for re-use and may be used to make other calls to the GitLab API. Developers can now pass in a type into the GitLab `paginated` and `pagedRequest` functions as generics instead of forcing `any` (defaults to `any` to maintain compatibility). The `GitLabClient` now provides a `isSelfManaged` convenience method.
