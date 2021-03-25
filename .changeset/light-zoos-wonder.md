---
'@backstage/plugin-auth-backend': patch
---

The `auth` config types now properly accept any declared auth environment. Previously only `development` was accepted.

The `audience` configuration is no longer required for GitLab auth; this will default to `https://gitlab.com`
