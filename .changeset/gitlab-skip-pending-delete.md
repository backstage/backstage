---
'@backstage/plugin-catalog-backend-module-gitlab': minor
---

Added a `skipReposMarkedForDeletion` option to the GitLab discovery provider (and the legacy `GitLabDiscoveryProcessor`). When set to `true`, projects that GitLab has marked for deletion (i.e. that report a non-empty `marked_for_deletion_on` value) are skipped during discovery. Defaults to `false`, so existing catalogs are unaffected.

Enabling this option causes the discovery API call to omit `simple=true`, since the deletion marker is not returned in the simple GitLab project response.
