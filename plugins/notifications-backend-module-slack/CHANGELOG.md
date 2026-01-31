# @backstage/plugin-notifications-backend-module-slack

## 0.3.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.21.0-next.0
  - @backstage/backend-plugin-api@1.7.0-next.0
  - @backstage/plugin-notifications-node@0.2.23-next.0
  - @backstage/catalog-model@1.7.6
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-notifications-common@0.2.0

## 0.3.0

### Minor Changes

- f95a516: Enables optional routes to Slack channels for broadcast notifications based on origin and/or topics.

### Patch Changes

- b80857a: Slack notification handler throttling can now be configured with the `concurrencyLimit` and `throttleInterval` options.
- f8230e4: Updated dependency `@faker-js/faker` to `^10.0.0`.
- Updated dependencies
  - @backstage/backend-plugin-api@1.6.0
  - @backstage/plugin-catalog-node@1.20.1
  - @backstage/plugin-notifications-node@0.2.22

## 0.2.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.6.0-next.1
  - @backstage/catalog-model@1.7.6
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-catalog-node@1.20.1-next.1
  - @backstage/plugin-notifications-common@0.2.0
  - @backstage/plugin-notifications-node@0.2.22-next.1

## 0.2.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.5.1-next.0
  - @backstage/plugin-catalog-node@1.20.1-next.0
  - @backstage/plugin-notifications-node@0.2.22-next.0
  - @backstage/config@1.3.6
  - @backstage/catalog-model@1.7.6
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-notifications-common@0.2.0

## 0.2.1

### Patch Changes

- d959bec: When an error message is logged due to inability to send a message with the Slack SDK, include the Slack Channel ID in the message to aid debugging.
- Updated dependencies
  - @backstage/plugin-catalog-node@1.20.0
  - @backstage/plugin-notifications-common@0.2.0
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-notifications-node@0.2.21
  - @backstage/config@1.3.6
  - @backstage/catalog-model@1.7.6

## 0.2.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-notifications-common@0.2.0-next.1
  - @backstage/backend-plugin-api@1.5.0-next.2
  - @backstage/plugin-notifications-node@0.2.21-next.2

## 0.2.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.20.0-next.1
  - @backstage/backend-plugin-api@1.5.0-next.1
  - @backstage/plugin-notifications-node@0.2.21-next.1

## 0.2.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-notifications-node@0.2.21-next.0
  - @backstage/config@1.3.6-next.0
  - @backstage/catalog-model@1.7.6-next.0
  - @backstage/backend-plugin-api@1.4.5-next.0
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-catalog-node@1.19.2-next.0
  - @backstage/plugin-notifications-common@0.1.2-next.0

## 0.2.0

### Minor Changes

- 3d09bb2: Adds username as optional config in order to send Slack notifications with a specific username in the case when using one Slack App for more than just Backstage.

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.5
  - @backstage/backend-plugin-api@1.4.4
  - @backstage/plugin-catalog-node@1.19.1
  - @backstage/plugin-notifications-common@0.1.1
  - @backstage/plugin-notifications-node@0.2.20

## 0.2.0-next.1

### Minor Changes

- 3d09bb2: Adds username as optional config in order to send Slack notifications with a specific username in the case when using one Slack App for more than just Backstage.

## 0.1.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.4-next.0
  - @backstage/backend-plugin-api@1.4.4-next.0
  - @backstage/plugin-notifications-common@0.1.1-next.0
  - @backstage/plugin-catalog-node@1.19.1-next.0
  - @backstage/plugin-notifications-node@0.2.20-next.0

## 0.1.5

### Patch Changes

- a95cebd: Internal refactoring for better type support
- Updated dependencies
  - @backstage/plugin-catalog-node@1.19.0
  - @backstage/types@1.2.2
  - @backstage/plugin-notifications-node@0.2.19
  - @backstage/backend-plugin-api@1.4.3

## 0.1.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.19.0-next.1
  - @backstage/plugin-notifications-node@0.2.19-next.1

## 0.1.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.3-next.0
  - @backstage/plugin-catalog-node@1.18.1-next.0
  - @backstage/plugin-notifications-node@0.2.19-next.0

## 0.1.4

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.18.0
  - @backstage/plugin-notifications-common@0.1.0
  - @backstage/plugin-notifications-node@0.2.18
  - @backstage/backend-plugin-api@1.4.2

## 0.1.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.18.0-next.0
  - @backstage/plugin-notifications-node@0.2.18-next.0
  - @backstage/backend-plugin-api@1.4.2-next.0
  - @backstage/catalog-model@1.7.5
  - @backstage/config@1.3.3
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-notifications-common@0.0.10

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
