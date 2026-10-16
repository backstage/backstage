---
'@backstage/plugin-auth-backend-module-atlassian-provider': minor
---

**BREAKING**: Removed the `usernameMatchingUserEntityName` sign-in resolver, along with the `atlassianSignInResolvers` export that only contained it. Atlassian user profiles do not contain a username, so the resolver could never work in an Atlassian environment anyway. Use the `emailMatchingUserEntityProfileEmail` or `emailLocalPartMatchingUserEntityName` resolvers instead.
