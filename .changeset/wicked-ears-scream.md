---
'@backstage/plugin-scaffolder-backend-module-gitlab': patch
---

Fixed a bug in `gitlab:group:ensureExists` where `repos` was always set as the root group.
