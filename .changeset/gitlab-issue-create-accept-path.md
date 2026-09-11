---
'@backstage/plugin-scaffolder-backend-module-gitlab': minor
---

The `gitlab:issues:create` action now accepts a full project path (e.g. `group/sub-group/project`) for `projectId`, and `projectId` is optional — when omitted the project is derived from `repoUrl` (matching the behaviour of `gitlab:merge-request`).
