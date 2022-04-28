---
'@backstage/plugin-auth-backend': patch
---

Add more common predefined sign-in resolvers to auth providers.

Add the existing resolver to more providers (already available at `google`):

- `providers.microsoft.resolvers.emailLocalPartMatchingUserEntityName()`
- `providers.okta.resolvers.emailLocalPartMatchingUserEntityName()`

Add a new resolver for simple email-to-email matching:

- `providers.google.resolvers.emailMatchingUserEntityProfileEmail()`
- `providers.microsoft.resolvers.emailMatchingUserEntityProfileEmail()`
- `providers.okta.resolvers.emailMatchingUserEntityProfileEmail()`
