---
'@backstage/plugin-auth-backend-module-microsoft-provider': minor
'@backstage/plugin-catalog-backend-module-msgraph': patch
---

Allow users without defined email to be ingested by the `msgraph` catalog plugin and add `userIdMatchingUserEntityAnnotation` sign-in resolver for the Microsoft auth provider to support sign-in for users without defined email.
