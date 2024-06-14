---
'@backstage/backend-defaults': patch
---

Added `@backstage/backend-defaults/auth`, `@backstage/backend-defaults/httpAuth`, and `@backstage/backend-defaults/userInfo` to house their respective backend service factories. You should now import these services from those new locations, instead of `@backstage/backend-app-api`.
