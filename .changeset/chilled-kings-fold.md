---
'@backstage/plugin-auth-backend-module-github-provider': patch
---

Fixed a bug where the requested scope was ignored when refreshing sessions for a GitHub OAuth App. This would lead to access tokens being returned that didn't have the requested scope, and in turn errors when trying to use these tokens.

As part of this fix all existing sessions are being revoked in order to ensure that they receive the correct scope.
