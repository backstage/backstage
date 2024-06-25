# @backstage/plugin-notifications-common

## 0.0.4

### Patch Changes

- d44a20a: Added additional plugin metadata to `package.json`.

## 0.0.4-next.0

### Patch Changes

- d44a20a: Added additional plugin metadata to `package.json`.

## 0.0.3

### Patch Changes

- 0d99528: Notification processor functions are now renamed to `preProcess` and `postProcess`.
  Additionally, processor name is now required to be returned by `getName`.
  A new processor functionality `processOptions` was added to process options before sending the notification.
- e003e0e: The ordered list of notifications' severities is exported by notifications-common for reusability.

## 0.0.2

### Patch Changes

- ba14c0e: Support for broadcast notifications
- a790a3d: Move notification origin resolving to backend with new auth
- 758f2a4: The Notifications frontend has been redesigned towards list view with condensed row details. The 'done' attribute has been removed to keep the Notifications aligned with the idea of a messaging system instead of a task manager.

## 0.0.2-next.1

### Patch Changes

- a790a3d: Move notification origin resolving to backend with new auth

## 0.0.2-next.0

### Patch Changes

- 758f2a4: The Notifications frontend has been redesigned towards list view with condensed row details. The 'done' attribute has been removed to keep the Notifications aligned with the idea of a messaging system instead of a task manager.

## 0.0.1

### Patch Changes

- 9873c44: Add support for signal type in notifications
- 8472188: Added or fixed the `repository` field in `package.json`.
- fb8fc24: Initial notifications system for backstage

## 0.0.1-next.1

### Patch Changes

- 8472188: Added or fixed the `repository` field in `package.json`.

## 0.0.1-next.0

### Patch Changes

- fb8fc24: Initial notifications system for backstage
