---
'@backstage/plugin-auth-common': minor
---

Adding new common library for the auth plugin. The static guest key values are stored here allowing for one location to facilitate maintenance. Adding optional `allowGuestMode` flag that is used to determine whether or not a `GuestUserEntity` is provided a valid guest key.
