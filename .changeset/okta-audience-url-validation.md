---
'@backstage/plugin-auth-backend-module-okta-provider': patch
---

Added a validation check that rejects `audience` configuration values that are not absolute URLs (i.e. missing `https://` or `http://` prefix).
