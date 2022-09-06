---
'@backstage/core-app-api': minor
'@backstage/plugin-user-settings-backend': minor
---

Add new plugin `@backstage/user-settings-backend` to store user related settings
in the database. Additionally adding a `UserSettingsStorage` implementation of
the `StorageApi` to easily use the new plugin as drop-in replacement for the
`WebStorage`.
