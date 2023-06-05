---
'@backstage/core-components': minor
---

`GuestUserIdentity` class is reworked to provide tokens for guest users that can be used to authenticate with the `auth-backend`. A guest user will now be provided a static guest-user-key if the `auth.allowGuestMode` flag is enabled in your app-config.
