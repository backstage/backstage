---
'@backstage/plugin-auth-backend-module-atlassian-provider': patch
---

Deprecated the `usernameMatchingUserEntityName` sign-in resolver. Atlassian user profiles do not contain a username, so the resolver always failed. It now fails with an error that points to the `emailMatchingUserEntityProfileEmail` and `emailLocalPartMatchingUserEntityName` resolvers instead.
