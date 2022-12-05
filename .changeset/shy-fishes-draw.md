---
'@backstage/plugin-bazaar-backend': patch
'@internal/plugin-todo-list-backend': patch
'@backstage/plugin-permission-backend': patch
'@backstage/plugin-playlist-backend': patch
'@backstage/plugin-scaffolder-backend': patch
'@backstage/plugin-user-settings-backend': patch
---

Updated the `getIdentity` calls with `optional: true` to make sure they work in a backward compatible way
