---
'@backstage/plugin-auth-backend-module-microsoft-provider': patch
'@backstage/plugin-catalog-backend-module-msgraph': patch
---

Update `catalog.providers.microsoftGraphOrg.target` config def to be optional as this has a default value.
Update `auth.microsoft.signIn.resolvers` config def to include the `userIdMatchingUserEntityAnnotation` resolver.
