---
'@backstage/integration': minor
'@backstage/backend-defaults': patch
---

Updates calls to Gitlab APIs to use a namespaced path in place of a project ID. This removes the need to call
a separate Gitlab API to determine the project ID for a project, resulting in significantly fewer API calls
to Gitlab, and faster catalog ingestion when syncing with Gitlab.

The signature of the `getGitLabFileFetchUrl` has changed. It is no longer asynchronous, and an unnecessary
parameter has been removed.
