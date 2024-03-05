# @backstage/plugin-notifications-backend

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
