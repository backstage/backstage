---
'@backstage/plugin-scaffolder-backend-module-gitlab': patch
---

`gitlab:group:ensureExists`: allow owner to be an existing GitLab user namespace when no subgroups are requested, and fail with a descriptive error if subgroups are specified under a personal namespace.
