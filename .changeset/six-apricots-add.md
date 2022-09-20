---
'@backstage/plugin-user-settings': patch
---

Added a `UserSettingsStorage` implementation of the `StorageApi` for use as
drop-in replacement for the `WebStorage`, in conjunction with the newly created
`@backstage/plugin-user-settings-backend`.
