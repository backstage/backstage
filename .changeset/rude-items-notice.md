---
'@backstage/plugin-auth-node': minor
---

Fixed an issue where the sign-in resolver was invoked during token refresh even when the authenticator did not provide a user profile, such as when refreshing resource-scoped tokens in the Microsoft provider. The resolver is now skipped in this case and no Backstage identity token is issued in the response.
