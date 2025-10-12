---
'@backstage/backend-defaults': patch
'@backstage/integration': patch
---

Updates calls to Gitlab APIs to use a namespaced path in place of a project ID. This removes the need to call
a separate Gitlab API to determine the project ID for a project, resulting in significantly fewer API calls
to Gitlab, and faster catalog ingestion when syncing with Gitlab.
