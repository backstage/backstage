---
'@backstage/plugin-auth-backend': minor
---

`TokenFactory` now adds a static ES256 key to the list of valid keys for authentication in the backend. This key is added only when the `allowGuestMode` flag is set in the `app-config` and only when we are in a development or test environment.
