---
'@backstage/plugin-user-settings': minor
---

**BREAKING**: The `apiRef` passed to `ProviderSettingsItem` now needs to
implement `ProfileInfoApi & SessionApi`, rather than just the latter. This is
unlikely to have an effect on most users though, since the builtin auth
providers generally implement both.

Fixed settings page showing providers as logged out when the user is using more
than one provider, and displayed some additional login information.
