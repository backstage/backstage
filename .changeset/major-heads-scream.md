---
'@backstage/plugin-catalog-backend-module-gitlab': minor
---

**BREAKING CHANGE**: User and Group discovery will default to ingesting all users in sub groups that belong to the specified root group in config. Disable by setting `restrictUsersToGroup: true` in app-config under your module settings.
