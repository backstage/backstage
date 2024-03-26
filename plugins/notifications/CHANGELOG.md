# @backstage/plugin-notifications

## 0.1.0

### Minor Changes

- 6e6d096: notifications can be newly sorted by list of predefined options
- cd96173: Notifications-backend URL query parameters changed from `sort/sortOrder` to `orderField` and `created_after` to `createdAfter` to unify with other plugins.
- 07abfe1: The NotificationsPage newly uses pagination implemented on the backend layer to avoid large dataset transfers
- 758f2a4: The Notifications frontend has been redesigned towards list view with condensed row details. The 'done' attribute has been removed to keep the Notifications aligned with the idea of a messaging system instead of a task manager.

### Patch Changes

- dff7a7e: All notifications can be marked and filtered by severity critical, high, normal or low, the default is 'normal'
- 75f2d84: the user can newly mark notifications as "Saved" for their better visibility in the future
- 5d9c5ba: The Notifications can be newly filtered based on the Created Date.
- Updated dependencies
  - @backstage/plugin-notifications-common@0.0.2
  - @backstage/core-components@0.14.1
  - @backstage/errors@1.2.4
  - @backstage/theme@0.5.2
  - @backstage/core-plugin-api@1.9.1
  - @backstage/types@1.1.1
  - @backstage/plugin-signals-react@0.0.2

## 0.1.0-next.2

### Minor Changes

- 6e6d096: notifications can be newly sorted by list of predefined options

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.2
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/errors@1.2.4-next.0
  - @backstage/theme@0.5.2-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-notifications-common@0.0.2-next.1
  - @backstage/plugin-signals-react@0.0.2-next.1

## 0.1.0-next.1

### Minor Changes

- 07abfe1: The NotificationsPage newly uses pagination implemented on the backend layer to avoid large dataset transfers

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/plugin-notifications-common@0.0.2-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/errors@1.2.4-next.0
  - @backstage/theme@0.5.2-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-signals-react@0.0.2-next.1

## 0.1.0-next.0

### Minor Changes

- 758f2a4: The Notifications frontend has been redesigned towards list view with condensed row details. The 'done' attribute has been removed to keep the Notifications aligned with the idea of a messaging system instead of a task manager.

### Patch Changes

- 5d9c5ba: The Notifications can be newly filtered based on the Created Date.
- Updated dependencies
  - @backstage/errors@1.2.4-next.0
  - @backstage/theme@0.5.2-next.0
  - @backstage/core-components@0.14.1-next.0
  - @backstage/plugin-notifications-common@0.0.2-next.0
  - @backstage/core-plugin-api@1.9.1-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-signals-react@0.0.2-next.0

## 0.0.1

### Patch Changes

- 9873c44: Add support for signal type in notifications
- 8472188: Added or fixed the `repository` field in `package.json`.
- fb8fc24: Initial notifications system for backstage
- Updated dependencies
  - @backstage/core-components@0.14.0
  - @backstage/plugin-signals-react@0.0.1
  - @backstage/plugin-notifications-common@0.0.1
  - @backstage/theme@0.5.1
  - @backstage/core-plugin-api@1.9.0
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.0.1-next.1

### Patch Changes

- 8472188: Added or fixed the `repository` field in `package.json`.
- Updated dependencies
  - @backstage/theme@0.5.1-next.1
  - @backstage/plugin-notifications-common@0.0.1-next.1
  - @backstage/plugin-signals-react@0.0.1-next.3
  - @backstage/core-components@0.14.0-next.2
  - @backstage/core-plugin-api@1.9.0-next.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.0.1-next.0

### Patch Changes

- fb8fc24: Initial notifications system for backstage
- Updated dependencies
  - @backstage/core-components@0.14.0-next.1
  - @backstage/plugin-signals-react@0.0.1-next.2
  - @backstage/core-plugin-api@1.9.0-next.1
  - @backstage/theme@0.5.1-next.0
  - @backstage/plugin-notifications-common@0.0.1-next.0
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
