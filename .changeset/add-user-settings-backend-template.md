---
'@backstage/create-app': patch
---

Added the user settings backend plugin to the create-app templates, enabling database-backed user settings persistence for newly created Backstage apps out of the box. The frontend storage API is also wired up to use backend-persisted storage instead of browser local storage, via the new `@backstage/plugin-app-module-user-settings` module.
