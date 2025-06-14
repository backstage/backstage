---
'@backstage/plugin-auth-backend-module-okta-provider': minor
---

Update @davidzemon/passport-okta-oauth to fix missing additionalScopes.
If a RBAC config previously behaved based on the absence of some scope, this
means the permission behavior may change.

Fixes: https://github.com/backstage/backstage/issues/27994
Signed-off-by: Robin H. Johnson <rjohnson@coreweave.com>
