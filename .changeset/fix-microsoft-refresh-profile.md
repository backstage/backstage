---
'@backstage/plugin-auth-backend-module-microsoft-provider': patch
---

Fixed an issue where acquiring tokens with non-Graph scopes (such as Azure Management API) would crash the sign-in resolver because the user profile was unavailable. This affected both the initial sign-in and later token refreshes. The Microsoft authenticator now makes a separate Graph API call to fetch the profile when the primary token targets a different resource. Setting the `skipUserProfile` configuration option to true disables this extra call.
