# @backstage/plugin-notifications-backend

## 0.2.1

### Patch Changes

- d541ff6: Fixed email processor `esm` issue and config reading
- 295c05d: Support for filtering entities from notification recipients after resolving them from the recipients
- d229dc4: Move path utilities from `backend-common` to the `backend-plugin-api` package.
- cba628a: Add possibility to generate random notifications on the fly in local development
- ee09dfc: Updated documentation for sending messages by external services.
- Updated dependencies
  - @backstage/catalog-model@1.5.0
  - @backstage/backend-common@0.22.0
  - @backstage/plugin-notifications-node@0.1.4
  - @backstage/backend-plugin-api@0.6.18
  - @backstage/plugin-events-node@0.3.4
  - @backstage/plugin-auth-node@0.4.13
  - @backstage/catalog-client@1.6.5
  - @backstage/plugin-signals-node@0.1.4

## 0.2.1-next.2

### Patch Changes

- d541ff6: Fixed email processor `esm` issue and config reading
- Updated dependencies
  - @backstage/backend-common@0.22.0-next.2
  - @backstage/plugin-events-node@0.3.4-next.2

## 0.2.1-next.1

### Patch Changes

- 295c05d: Support for filtering entities from notification recipients after resolving them from the recipients
- cba628a: Add possibility to generate random notifications on the fly in local development
- Updated dependencies
  - @backstage/plugin-notifications-node@0.1.4-next.1
  - @backstage/backend-common@0.22.0-next.1
  - @backstage/plugin-auth-node@0.4.13-next.1
  - @backstage/plugin-events-node@0.3.4-next.1
  - @backstage/plugin-signals-node@0.1.4-next.1
  - @backstage/backend-plugin-api@0.6.18-next.1

## 0.2.1-next.0

### Patch Changes

- ee09dfc: Updated documentation for sending messages by external services.
- Updated dependencies
  - @backstage/catalog-model@1.5.0-next.0
  - @backstage/plugin-auth-node@0.4.13-next.0
  - @backstage/backend-common@0.21.8-next.0
  - @backstage/backend-plugin-api@0.6.18-next.0
  - @backstage/catalog-client@1.6.5-next.0
  - @backstage/plugin-notifications-node@0.1.4-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-events-node@0.3.4-next.0
  - @backstage/plugin-notifications-common@0.0.3
  - @backstage/plugin-signals-node@0.1.4-next.0

## 0.2.0

### Minor Changes

- 939b4ec: Notifications-backend URL query parameter changed from `minimal_severity` to `minimumSeverity`.
- ec40998: On the Notifications page, the user can trigger "Save" or "Mark as read" actions once for multiple selected notifications.

### Patch Changes

- 0d99528: Notification processor functions are now renamed to `preProcess` and `postProcess`.
  Additionally, processor name is now required to be returned by `getName`.
  A new processor functionality `processOptions` was added to process options before sending the notification.
- e003e0e: The ordered list of notifications' severities is exported by notifications-common for reusability.
- 9a41a7b: Migrate signals and notifications to the new backend in local development
- 9987066: fix: retrieve relations and children when mapping group entities for notifications
- 6206039: Fix entity owner resolution in notifications
- Updated dependencies
  - @backstage/backend-common@0.21.7
  - @backstage/plugin-notifications-common@0.0.3
  - @backstage/plugin-notifications-node@0.1.3
  - @backstage/backend-plugin-api@0.6.17
  - @backstage/plugin-auth-node@0.4.12
  - @backstage/catalog-client@1.6.4
  - @backstage/plugin-events-node@0.3.3
  - @backstage/plugin-signals-node@0.1.3
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.2.0-next.1

### Minor Changes

- ec40998: On the Notifications page, the user can trigger "Save" or "Mark as read" actions once for multiple selected notifications.

### Patch Changes

- 9987066: fix: retrieve relations and children when mapping group entities for notifications
- Updated dependencies
  - @backstage/backend-common@0.21.7-next.1
  - @backstage/backend-plugin-api@0.6.17-next.1
  - @backstage/plugin-auth-node@0.4.12-next.1
  - @backstage/catalog-client@1.6.4-next.0
  - @backstage/plugin-events-node@0.3.3-next.1
  - @backstage/plugin-notifications-node@0.1.3-next.1
  - @backstage/plugin-signals-node@0.1.3-next.1
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-notifications-common@0.0.2

## 0.1.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.7-next.0
  - @backstage/backend-plugin-api@0.6.17-next.0
  - @backstage/catalog-client@1.6.3
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-auth-node@0.4.12-next.0
  - @backstage/plugin-events-node@0.3.3-next.0
  - @backstage/plugin-notifications-common@0.0.2
  - @backstage/plugin-notifications-node@0.1.3-next.0
  - @backstage/plugin-signals-node@0.1.3-next.0

## 0.1.2

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.6.3
  - @backstage/plugin-auth-node@0.4.11
  - @backstage/backend-common@0.21.6
  - @backstage/plugin-notifications-node@0.1.2
  - @backstage/backend-plugin-api@0.6.16
  - @backstage/plugin-signals-node@0.1.2
  - @backstage/plugin-events-node@0.3.2
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-notifications-common@0.0.2

## 0.1.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.6.2
  - @backstage/backend-common@0.21.5
  - @backstage/plugin-auth-node@0.4.10
  - @backstage/plugin-notifications-node@0.1.1
  - @backstage/plugin-events-node@0.3.1
  - @backstage/plugin-signals-node@0.1.1
  - @backstage/backend-plugin-api@0.6.15
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-notifications-common@0.0.2

## 0.1.0

### Minor Changes

- 6e6d096: notifications can be newly sorted by list of predefined options
- cd96173: Notifications-backend URL query parameters changed from `sort/sortOrder` to `orderField` and `created_after` to `createdAfter` to unify with other plugins.
- 07abfe1: The NotificationsPage newly uses pagination implemented on the backend layer to avoid large dataset transfers
- daf85dc: BREAKING CHANGE: Migrates signals to use the `EventsService` and makes it mandatory
- 758f2a4: The Notifications frontend has been redesigned towards list view with condensed row details. The 'done' attribute has been removed to keep the Notifications aligned with the idea of a messaging system instead of a task manager.

### Patch Changes

- ba14c0e: Support for broadcast notifications
- dff7a7e: All notifications can be marked and filtered by severity critical, high, normal or low, the default is 'normal'
- 4467036: Allow unauthenticated access to health check endpoint.
- 6c1547a: **BREAKING** Type definition added to signal recipients

  Update to use `{type: 'broadcast'}` instead `null` and `{type: 'user', entityRef: ''}`
  instead string entity references

- 75f2d84: the user can newly mark notifications as "Saved" for their better visibility in the future
- a790a3d: Move notification origin resolving to backend with new auth
- 5d9c5ba: The Notifications can be newly filtered based on the Created Date.
- 0fb419b: Updated dependency `uuid` to `^9.0.0`.
  Updated dependency `@types/uuid` to `^9.0.0`.
- 84af361: Migrated to using the new auth services.
- 6d84ee6: Changed to use the refactored signal service naming
- Updated dependencies
  - @backstage/plugin-notifications-common@0.0.2
  - @backstage/plugin-notifications-node@0.1.0
  - @backstage/plugin-events-node@0.3.0
  - @backstage/backend-common@0.21.4
  - @backstage/plugin-auth-node@0.4.9
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-signals-node@0.1.0
  - @backstage/backend-plugin-api@0.6.14
  - @backstage/catalog-client@1.6.1
  - @backstage/catalog-model@1.4.5

## 0.1.0-next.2

### Minor Changes

- 6e6d096: notifications can be newly sorted by list of predefined options

### Patch Changes

- 6d84ee6: Changed to use the refactored signal service naming
- Updated dependencies
  - @backstage/plugin-signals-node@0.1.0-next.2
  - @backstage/catalog-client@1.6.1-next.1
  - @backstage/backend-common@0.21.4-next.2
  - @backstage/plugin-notifications-node@0.1.0-next.2
  - @backstage/plugin-auth-node@0.4.9-next.2
  - @backstage/backend-plugin-api@0.6.14-next.2
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/config@1.2.0-next.1
  - @backstage/errors@1.2.4-next.0
  - @backstage/plugin-events-node@0.3.0-next.2
  - @backstage/plugin-notifications-common@0.0.2-next.1

## 0.1.0-next.1

### Minor Changes

- 07abfe1: The NotificationsPage newly uses pagination implemented on the backend layer to avoid large dataset transfers
- daf85dc: BREAKING CHANGE: Migrates signals to use the `EventsService` and makes it mandatory

### Patch Changes

- a790a3d: Move notification origin resolving to backend with new auth
- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/plugin-notifications-common@0.0.2-next.1
  - @backstage/plugin-notifications-node@0.1.0-next.1
  - @backstage/plugin-signals-node@0.1.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/plugin-auth-node@0.4.9-next.1
  - @backstage/catalog-client@1.6.1-next.0
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/plugin-events-node@0.3.0-next.1

## 0.1.0-next.0

### Minor Changes

- 758f2a4: The Notifications frontend has been redesigned towards list view with condensed row details. The 'done' attribute has been removed to keep the Notifications aligned with the idea of a messaging system instead of a task manager.

### Patch Changes

- 5d9c5ba: The Notifications can be newly filtered based on the Created Date.
- 0fb419b: Updated dependency `uuid` to `^9.0.0`.
  Updated dependency `@types/uuid` to `^9.0.0`.
- 84af361: Migrated to using the new auth services.
- Updated dependencies
  - @backstage/plugin-events-node@0.3.0-next.0
  - @backstage/backend-common@0.21.3-next.0
  - @backstage/plugin-auth-node@0.4.8-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/backend-plugin-api@0.6.13-next.0
  - @backstage/plugin-notifications-node@0.1.0-next.0
  - @backstage/plugin-signals-node@0.0.4-next.0
  - @backstage/plugin-notifications-common@0.0.2-next.0
  - @backstage/catalog-client@1.6.1-next.0
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/config@1.1.2-next.0

## 0.0.1

### Patch Changes

- 9873c44: Add support for signal type in notifications
- 8472188: Added or fixed the `repository` field in `package.json`.
- fb8fc24: Initial notifications system for backstage
- Updated dependencies
  - @backstage/backend-common@0.21.0
  - @backstage/plugin-auth-node@0.4.4
  - @backstage/plugin-signals-node@0.0.1
  - @backstage/plugin-notifications-common@0.0.1
  - @backstage/backend-plugin-api@0.6.10
  - @backstage/catalog-model@1.4.4
  - @backstage/catalog-client@1.6.0
  - @backstage/plugin-notifications-node@0.0.1
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-events-node@0.2.19

## 0.0.1-next.1

### Patch Changes

- 8472188: Added or fixed the `repository` field in `package.json`.
- Updated dependencies
  - @backstage/backend-common@0.21.0-next.3
  - @backstage/plugin-notifications-common@0.0.1-next.1
  - @backstage/plugin-notifications-node@0.0.1-next.1
  - @backstage/plugin-signals-node@0.0.1-next.3
  - @backstage/plugin-auth-node@0.4.4-next.3
  - @backstage/backend-plugin-api@0.6.10-next.3
  - @backstage/catalog-client@1.6.0-next.1
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-events-node@0.2.19-next.3

## 0.0.1-next.0

### Patch Changes

- fb8fc24: Initial notifications system for backstage
- Updated dependencies
  - @backstage/backend-common@0.21.0-next.2
  - @backstage/plugin-signals-node@0.0.1-next.2
  - @backstage/backend-plugin-api@0.6.10-next.2
  - @backstage/plugin-auth-node@0.4.4-next.2
  - @backstage/plugin-notifications-common@0.0.1-next.0
  - @backstage/plugin-notifications-node@0.0.1-next.0
  - @backstage/plugin-events-node@0.2.19-next.2
  - @backstage/config@1.1.1
  - @backstage/catalog-client@1.6.0-next.1
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/errors@1.2.3
