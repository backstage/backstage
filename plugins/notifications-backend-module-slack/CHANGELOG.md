# @backstage/plugin-notifications-backend-module-slack

## 0.1.3

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.3
  - @backstage/catalog-model@1.7.5
  - @backstage/backend-plugin-api@1.4.1
  - @backstage/plugin-catalog-node@1.17.2
  - @backstage/plugin-notifications-common@0.0.10
  - @backstage/plugin-notifications-node@0.2.17

## 0.1.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.3-next.0
  - @backstage/catalog-model@1.7.5-next.0
  - @backstage/backend-plugin-api@1.4.1-next.0
  - @backstage/plugin-notifications-common@0.0.10-next.0
  - @backstage/plugin-catalog-node@1.17.2-next.0
  - @backstage/plugin-notifications-node@0.2.17-next.0

## 0.1.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-notifications-common@0.0.9
  - @backstage/plugin-catalog-node@1.17.1
  - @backstage/backend-plugin-api@1.4.0
  - @backstage/plugin-notifications-node@0.2.16
  - @backstage/catalog-model@1.7.4
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1

## 0.1.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-notifications-common@0.0.9-next.0
  - @backstage/plugin-catalog-node@1.17.1-next.1
  - @backstage/plugin-notifications-node@0.2.16-next.1
  - @backstage/backend-plugin-api@1.4.0-next.1
  - @backstage/catalog-model@1.7.4
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1

## 0.1.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.0-next.0
  - @backstage/plugin-catalog-node@1.17.1-next.0
  - @backstage/plugin-notifications-node@0.2.16-next.0

## 0.1.1

### Patch Changes

- 4f10768: Fix slack notification processor to handle a notification with an empty description
- f6480c7: Fix dataloader caching, and use the proper catalog service ref
- a1c5bbb: Added email-based Slack User ID lookup if `metadata.annotations.slack.com/bot-notify` is missing from user entity
- e099d0a: Notifications which mention user entity refs are now replaced with Slack compatible mentions.

  Example: `Welcome <@user:default/billy>!` -> `Welcome <@U123456890>!`

- Updated dependencies
  - @backstage/catalog-model@1.7.4
  - @backstage/plugin-catalog-node@1.17.0
  - @backstage/backend-plugin-api@1.3.1
  - @backstage/config@1.3.2
  - @backstage/plugin-notifications-node@0.2.15
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-notifications-common@0.0.8

## 0.1.1-next.3

### Patch Changes

- f6480c7: Fix dataloader caching, and use the proper catalog service ref
- e099d0a: Notifications which mention user entity refs are now replaced with Slack compatible mentions.

  Example: `Welcome <@user:default/billy>!` -> `Welcome <@U123456890>!`

- Updated dependencies
  - @backstage/backend-plugin-api@1.3.1-next.2
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-node@1.17.0-next.2
  - @backstage/plugin-notifications-common@0.0.8
  - @backstage/plugin-notifications-node@0.2.15-next.2

## 0.1.1-next.2

### Patch Changes

- 4f10768: Fix slack notification processor to handle a notification with an empty description
- Updated dependencies
  - @backstage/config@1.3.2
  - @backstage/plugin-notifications-node@0.2.15-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/catalog-client@1.10.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-notifications-common@0.0.8

## 0.1.1-next.1

### Patch Changes

- a1c5bbb: Added email-based Slack User ID lookup if `metadata.annotations.slack.com/bot-notify` is missing from user entity
- Updated dependencies
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/catalog-client@1.10.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-notifications-common@0.0.8
  - @backstage/plugin-notifications-node@0.2.15-next.1

## 0.1.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.10.0-next.0
  - @backstage/backend-plugin-api@1.3.1-next.0
  - @backstage/plugin-notifications-node@0.2.15-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-notifications-common@0.0.8

## 0.1.0

### Minor Changes

- 552170d: Added a new Slack NotificationProcessor for use with the notifications plugin

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.3.0
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-notifications-common@0.0.8
  - @backstage/plugin-notifications-node@0.2.14

## 0.1.0-next.0

### Minor Changes

- 552170d: Added a new Slack NotificationProcessor for use with the notifications plugin

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.2.1
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-notifications-common@0.0.8
  - @backstage/plugin-notifications-node@0.2.13
