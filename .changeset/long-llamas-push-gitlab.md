---
'@backstage/plugin-auth-backend-module-gitlab-provider': patch
---

Added support for the new shared `additionalScopes` configuration. In addition, the `read_user` scope has been set to required and will always be present.
