# @backstage/plugin-notifications-node

## 0.2.21

### Patch Changes

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/plugin-notifications-common@0.2.0
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/catalog-model@1.7.6
  - @backstage/catalog-client@1.12.1
  - @backstage/plugin-signals-node@0.1.26

## 0.2.21-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-notifications-common@0.2.0-next.1
  - @backstage/backend-plugin-api@1.5.0-next.2

## 0.2.21-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0-next.1
  - @backstage/plugin-signals-node@0.1.26-next.1

## 0.2.21-next.0

### Patch Changes

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/catalog-model@1.7.6-next.0
  - @backstage/backend-plugin-api@1.4.5-next.0
  - @backstage/catalog-client@1.12.1-next.0
  - @backstage/plugin-notifications-common@0.1.2-next.0
  - @backstage/plugin-signals-node@0.1.26-next.0

## 0.2.20

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.4
  - @backstage/plugin-notifications-common@0.1.1
  - @backstage/plugin-signals-node@0.1.25

## 0.2.20-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.4-next.0
  - @backstage/plugin-notifications-common@0.1.1-next.0
  - @backstage/plugin-signals-node@0.1.25-next.0
  - @backstage/catalog-client@1.12.0

## 0.2.19

### Patch Changes

- 7e7ed57: A new extension point was added that can be used to modify how the users receiving notifications
  are resolved. The interface passed to the extension point should only return complete user entity references
  based on the notification target references and the excluded entity references. Note that the inputs are lists
  of entity references that can be any entity kind, not just user entities.

  Using this extension point will override the default behavior of resolving users with the
  `DefaultNotificationRecipientResolver`.

- Updated dependencies
  - @backstage/catalog-client@1.12.0
  - @backstage/backend-plugin-api@1.4.3
  - @backstage/plugin-signals-node@0.1.24

## 0.2.19-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.12.0-next.0

## 0.2.19-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.3-next.0
  - @backstage/plugin-signals-node@0.1.24-next.0

## 0.2.18

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.11.0
  - @backstage/plugin-notifications-common@0.1.0
  - @backstage/backend-plugin-api@1.4.2
  - @backstage/plugin-signals-node@0.1.23

## 0.2.18-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.11.0-next.0
  - @backstage/backend-plugin-api@1.4.2-next.0
  - @backstage/catalog-model@1.7.5
  - @backstage/plugin-notifications-common@0.0.10
  - @backstage/plugin-signals-node@0.1.23-next.0

## 0.2.17

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.7.5
  - @backstage/catalog-client@1.10.2
  - @backstage/backend-plugin-api@1.4.1
  - @backstage/plugin-notifications-common@0.0.10
  - @backstage/plugin-signals-node@0.1.22

## 0.2.17-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.7.5-next.0
  - @backstage/catalog-client@1.10.2-next.0
  - @backstage/backend-plugin-api@1.4.1-next.0
  - @backstage/plugin-notifications-common@0.0.10-next.0
  - @backstage/plugin-signals-node@0.1.22-next.0

## 0.2.16

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.10.1
  - @backstage/plugin-notifications-common@0.0.9
  - @backstage/backend-plugin-api@1.4.0
  - @backstage/catalog-model@1.7.4
  - @backstage/plugin-signals-node@0.1.21

## 0.2.16-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.10.1-next.0
  - @backstage/plugin-notifications-common@0.0.9-next.0
  - @backstage/backend-plugin-api@1.4.0-next.1
  - @backstage/catalog-model@1.7.4
  - @backstage/plugin-signals-node@0.1.21-next.1

## 0.2.16-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.0-next.0
  - @backstage/plugin-signals-node@0.1.21-next.0

## 0.2.15

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.7.4
  - @backstage/backend-plugin-api@1.3.1
  - @backstage/catalog-client@1.10.0
  - @backstage/plugin-notifications-common@0.0.8
  - @backstage/plugin-signals-node@0.1.20

## 0.2.15-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.3.1-next.2
  - @backstage/catalog-client@1.10.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/plugin-notifications-common@0.0.8
  - @backstage/plugin-signals-node@0.1.20-next.2

## 0.2.15-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/plugin-signals-node@0.1.20-next.1
  - @backstage/catalog-client@1.10.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/plugin-notifications-common@0.0.8

## 0.2.15-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.10.0-next.0
  - @backstage/backend-plugin-api@1.3.1-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/plugin-notifications-common@0.0.8
  - @backstage/plugin-signals-node@0.1.20-next.0

## 0.2.14

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.3.0
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/plugin-notifications-common@0.0.8
  - @backstage/plugin-signals-node@0.1.19

## 0.2.13

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.2.1
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/plugin-notifications-common@0.0.8
  - @backstage/plugin-signals-node@0.1.18

## 0.2.13-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.2.1-next.1
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/plugin-notifications-common@0.0.8
  - @backstage/plugin-signals-node@0.1.18-next.2

## 0.2.13-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.2.1-next.1
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/plugin-notifications-common@0.0.8
  - @backstage/plugin-signals-node@0.1.18-next.1

## 0.2.13-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.2.1-next.0
  - @backstage/plugin-signals-node@0.1.18-next.0

## 0.2.12

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.2.0
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/plugin-notifications-common@0.0.8
  - @backstage/plugin-signals-node@0.1.17

## 0.2.12-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.2.0-next.2
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/plugin-notifications-common@0.0.8
  - @backstage/plugin-signals-node@0.1.17-next.2

## 0.2.12-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.2.0-next.1
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/plugin-notifications-common@0.0.8
  - @backstage/plugin-signals-node@0.1.17-next.1

## 0.2.12-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.2.0-next.0
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/plugin-notifications-common@0.0.8
  - @backstage/plugin-signals-node@0.1.17-next.0

## 0.2.11

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.1.1
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/plugin-notifications-common@0.0.8
  - @backstage/plugin-signals-node@0.1.16

## 0.2.11-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.1.1-next.1
  - @backstage/catalog-model@1.7.3-next.0
  - @backstage/plugin-signals-node@0.1.16-next.1
  - @backstage/catalog-client@1.9.1-next.0
  - @backstage/plugin-notifications-common@0.0.8-next.0

## 0.2.11-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.1.1-next.0
  - @backstage/catalog-client@1.9.0
  - @backstage/catalog-model@1.7.2
  - @backstage/plugin-notifications-common@0.0.7
  - @backstage/plugin-signals-node@0.1.16-next.0

## 0.2.10

### Patch Changes

- 5c9cc05: Use native fetch instead of node-fetch
- Updated dependencies
  - @backstage/backend-plugin-api@1.1.0
  - @backstage/catalog-client@1.9.0
  - @backstage/catalog-model@1.7.2
  - @backstage/plugin-notifications-common@0.0.7
  - @backstage/plugin-signals-node@0.1.15

## 0.2.10-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.1.0-next.2
  - @backstage/plugin-signals-node@0.1.15-next.2
  - @backstage/catalog-client@1.9.0-next.2
  - @backstage/catalog-model@1.7.2-next.0
  - @backstage/plugin-notifications-common@0.0.7-next.0

## 0.2.10-next.1

### Patch Changes

- 5c9cc05: Use native fetch instead of node-fetch
- Updated dependencies
  - @backstage/catalog-client@1.9.0-next.1
  - @backstage/backend-plugin-api@1.1.0-next.1
  - @backstage/plugin-signals-node@0.1.15-next.1
  - @backstage/catalog-model@1.7.1
  - @backstage/plugin-notifications-common@0.0.6

## 0.2.10-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.3-next.0
  - @backstage/catalog-client@1.8.1-next.0
  - @backstage/catalog-model@1.7.1
  - @backstage/plugin-notifications-common@0.0.6
  - @backstage/plugin-signals-node@0.1.15-next.0

## 0.2.9

### Patch Changes

- 4e58bc7: Upgrade to uuid v11 internally
- 5d74716: Remove unused backend-common dependency
- Updated dependencies
  - @backstage/catalog-client@1.8.0
  - @backstage/backend-plugin-api@1.0.2
  - @backstage/plugin-notifications-common@0.0.6
  - @backstage/plugin-signals-node@0.1.14
  - @backstage/catalog-model@1.7.1

## 0.2.9-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.2-next.2
  - @backstage/catalog-client@1.8.0-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/plugin-notifications-common@0.0.6-next.0
  - @backstage/plugin-signals-node@0.1.14-next.3

## 0.2.9-next.2

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.8.0-next.1
  - @backstage/backend-plugin-api@1.0.2-next.2
  - @backstage/catalog-model@1.7.0
  - @backstage/plugin-notifications-common@0.0.6-next.0
  - @backstage/plugin-signals-node@0.1.14-next.2

## 0.2.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.2-next.1
  - @backstage/catalog-client@1.8.0-next.0
  - @backstage/catalog-model@1.7.0
  - @backstage/plugin-notifications-common@0.0.6-next.0
  - @backstage/plugin-signals-node@0.1.14-next.1

## 0.2.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-notifications-common@0.0.6-next.0
  - @backstage/catalog-client@1.8.0-next.0
  - @backstage/backend-plugin-api@1.0.2-next.0
  - @backstage/catalog-model@1.7.0
  - @backstage/plugin-signals-node@0.1.14-next.0

## 0.2.7

### Patch Changes

- 094eaa3: Remove references to in-repo backend-common
- Updated dependencies
  - @backstage/plugin-signals-node@0.1.12
  - @backstage/catalog-client@1.7.1
  - @backstage/backend-plugin-api@1.0.1
  - @backstage/catalog-model@1.7.0
  - @backstage/plugin-notifications-common@0.0.5

## 0.2.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.7.1-next.0
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/plugin-notifications-common@0.0.5
  - @backstage/plugin-signals-node@0.1.12-next.1

## 0.2.7-next.0

### Patch Changes

- 094eaa3: Remove references to in-repo backend-common
- Updated dependencies
  - @backstage/plugin-signals-node@0.1.12-next.0
  - @backstage/backend-plugin-api@1.0.1-next.0
  - @backstage/catalog-client@1.7.0
  - @backstage/catalog-model@1.7.0
  - @backstage/plugin-notifications-common@0.0.5

## 0.2.6

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.25.0
  - @backstage/plugin-signals-node@0.1.11
  - @backstage/backend-plugin-api@1.0.0
  - @backstage/catalog-model@1.7.0
  - @backstage/catalog-client@1.7.0
  - @backstage/plugin-notifications-common@0.0.5

## 0.2.6-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.25.0-next.2
  - @backstage/backend-plugin-api@1.0.0-next.2
  - @backstage/catalog-client@1.7.0-next.1
  - @backstage/catalog-model@1.6.0
  - @backstage/plugin-notifications-common@0.0.5
  - @backstage/plugin-signals-node@0.1.11-next.2

## 0.2.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.25.0-next.1
  - @backstage/catalog-client@1.6.7-next.0
  - @backstage/backend-plugin-api@0.9.0-next.1
  - @backstage/catalog-model@1.6.0
  - @backstage/plugin-notifications-common@0.0.5
  - @backstage/plugin-signals-node@0.1.11-next.1

## 0.2.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.9.0-next.0
  - @backstage/backend-common@0.25.0-next.0
  - @backstage/plugin-signals-node@0.1.11-next.0
  - @backstage/catalog-client@1.6.6
  - @backstage/catalog-model@1.6.0
  - @backstage/plugin-notifications-common@0.0.5

## 0.2.4

### Patch Changes

- 93095ee: Make sure node-fetch is version 2.7.0 or greater
- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0
  - @backstage/backend-common@0.24.0
  - @backstage/catalog-model@1.6.0
  - @backstage/catalog-client@1.6.6
  - @backstage/plugin-notifications-common@0.0.5
  - @backstage/plugin-signals-node@0.1.9

## 0.2.4-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.3
  - @backstage/backend-common@0.23.4-next.3
  - @backstage/catalog-model@1.6.0-next.0
  - @backstage/catalog-client@1.6.6-next.0
  - @backstage/plugin-notifications-common@0.0.5
  - @backstage/plugin-signals-node@0.1.9-next.3

## 0.2.4-next.2

### Patch Changes

- 93095ee: Make sure node-fetch is version 2.7.0 or greater
- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.2
  - @backstage/backend-common@0.23.4-next.2
  - @backstage/plugin-signals-node@0.1.9-next.2
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/plugin-notifications-common@0.0.5

## 0.2.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.7.1-next.1
  - @backstage/backend-common@0.23.4-next.1
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/plugin-notifications-common@0.0.5
  - @backstage/plugin-signals-node@0.1.9-next.1

## 0.2.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.23.4-next.0
  - @backstage/backend-plugin-api@0.7.1-next.0
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/plugin-notifications-common@0.0.5
  - @backstage/plugin-signals-node@0.1.9-next.0

## 0.2.3

### Patch Changes

- 4e4ef2b: Move notification processor filter parsing to common package
- Updated dependencies
  - @backstage/backend-plugin-api@0.7.0
  - @backstage/backend-common@0.23.3
  - @backstage/plugin-notifications-common@0.0.5
  - @backstage/plugin-signals-node@0.1.8
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0

## 0.2.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.23.3-next.1
  - @backstage/backend-plugin-api@0.6.22-next.1
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/plugin-notifications-common@0.0.4
  - @backstage/plugin-signals-node@0.1.8-next.1

## 0.2.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.21-next.0
  - @backstage/backend-common@0.23.2-next.0
  - @backstage/plugin-signals-node@0.1.7-next.0
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/plugin-notifications-common@0.0.4

## 0.2.0

### Minor Changes

- 07a789b: add notifications filtering by processors

### Patch Changes

- d44a20a: Added additional plugin metadata to `package.json`.
- 1354d81: Use `node-fetch` instead of native fetch, as per https://backstage.io/docs/architecture-decisions/adrs-adr013
- Updated dependencies
  - @backstage/backend-common@0.23.0
  - @backstage/backend-plugin-api@0.6.19
  - @backstage/plugin-notifications-common@0.0.4
  - @backstage/plugin-signals-node@0.1.5
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0

## 0.2.0-next.3

### Patch Changes

- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.3
  - @backstage/plugin-notifications-common@0.0.4-next.0
  - @backstage/plugin-signals-node@0.1.5-next.3
  - @backstage/backend-common@0.23.0-next.3
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0

## 0.2.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.2
  - @backstage/backend-common@0.23.0-next.2
  - @backstage/plugin-signals-node@0.1.5-next.2
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/plugin-notifications-common@0.0.3

## 0.2.0-next.1

### Minor Changes

- 07a789b: add notifications filtering by processors

### Patch Changes

- 1354d81: Use `node-fetch` instead of native fetch, as per https://backstage.io/docs/architecture-decisions/adrs-adr013
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.1
  - @backstage/backend-common@0.23.0-next.1
  - @backstage/plugin-signals-node@0.1.5-next.1

## 0.1.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.22.1-next.0
  - @backstage/backend-plugin-api@0.6.19-next.0
  - @backstage/plugin-signals-node@0.1.5-next.0
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/plugin-notifications-common@0.0.3

## 0.1.4

### Patch Changes

- 295c05d: Support for filtering entities from notification recipients after resolving them from the recipients
- Updated dependencies
  - @backstage/catalog-model@1.5.0
  - @backstage/backend-common@0.22.0
  - @backstage/backend-plugin-api@0.6.18
  - @backstage/catalog-client@1.6.5
  - @backstage/plugin-signals-node@0.1.4

## 0.1.4-next.1

### Patch Changes

- 295c05d: Support for filtering entities from notification recipients after resolving them from the recipients
- Updated dependencies
  - @backstage/backend-common@0.22.0-next.1
  - @backstage/plugin-signals-node@0.1.4-next.1
  - @backstage/backend-plugin-api@0.6.18-next.1

## 0.1.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.5.0-next.0
  - @backstage/backend-common@0.21.8-next.0
  - @backstage/backend-plugin-api@0.6.18-next.0
  - @backstage/catalog-client@1.6.5-next.0
  - @backstage/plugin-notifications-common@0.0.3
  - @backstage/plugin-signals-node@0.1.4-next.0

## 0.1.3

### Patch Changes

- 0d99528: Notification processor functions are now renamed to `preProcess` and `postProcess`.
  Additionally, processor name is now required to be returned by `getName`.
  A new processor functionality `processOptions` was added to process options before sending the notification.
- Updated dependencies
  - @backstage/backend-common@0.21.7
  - @backstage/plugin-notifications-common@0.0.3
  - @backstage/backend-plugin-api@0.6.17
  - @backstage/catalog-client@1.6.4
  - @backstage/plugin-signals-node@0.1.3
  - @backstage/catalog-model@1.4.5

## 0.1.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.7-next.1
  - @backstage/backend-plugin-api@0.6.17-next.1
  - @backstage/catalog-client@1.6.4-next.0
  - @backstage/plugin-signals-node@0.1.3-next.1
  - @backstage/catalog-model@1.4.5
  - @backstage/plugin-notifications-common@0.0.2

## 0.1.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.7-next.0
  - @backstage/backend-plugin-api@0.6.17-next.0
  - @backstage/catalog-client@1.6.3
  - @backstage/catalog-model@1.4.5
  - @backstage/plugin-notifications-common@0.0.2
  - @backstage/plugin-signals-node@0.1.3-next.0

## 0.1.2

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.6.3
  - @backstage/backend-common@0.21.6
  - @backstage/backend-plugin-api@0.6.16
  - @backstage/plugin-signals-node@0.1.2
  - @backstage/catalog-model@1.4.5
  - @backstage/plugin-notifications-common@0.0.2

## 0.1.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.6.2
  - @backstage/backend-common@0.21.5
  - @backstage/plugin-signals-node@0.1.1
  - @backstage/backend-plugin-api@0.6.15
  - @backstage/catalog-model@1.4.5
  - @backstage/plugin-notifications-common@0.0.2

## 0.1.0

### Minor Changes

- 84af361: Migrated to using the new auth services.

### Patch Changes

- ba14c0e: Support for broadcast notifications
- a790a3d: Move notification origin resolving to backend with new auth
- 0fb419b: Updated dependency `uuid` to `^9.0.0`.
  Updated dependency `@types/uuid` to `^9.0.0`.
- Updated dependencies
  - @backstage/plugin-notifications-common@0.0.2
  - @backstage/backend-common@0.21.4
  - @backstage/plugin-signals-node@0.1.0
  - @backstage/backend-plugin-api@0.6.14
  - @backstage/catalog-client@1.6.1
  - @backstage/catalog-model@1.4.5

## 0.1.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-signals-node@0.1.0-next.2
  - @backstage/catalog-client@1.6.1-next.1
  - @backstage/backend-common@0.21.4-next.2
  - @backstage/backend-plugin-api@0.6.14-next.2
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/plugin-notifications-common@0.0.2-next.1

## 0.1.0-next.1

### Patch Changes

- a790a3d: Move notification origin resolving to backend with new auth
- Updated dependencies
  - @backstage/plugin-notifications-common@0.0.2-next.1
  - @backstage/plugin-signals-node@0.1.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/catalog-client@1.6.1-next.0
  - @backstage/catalog-model@1.4.5-next.0

## 0.1.0-next.0

### Minor Changes

- 84af361: Migrated to using the new auth services.

### Patch Changes

- 0fb419b: Updated dependency `uuid` to `^9.0.0`.
  Updated dependency `@types/uuid` to `^9.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.21.3-next.0
  - @backstage/backend-plugin-api@0.6.13-next.0
  - @backstage/plugin-signals-node@0.0.4-next.0
  - @backstage/plugin-notifications-common@0.0.2-next.0
  - @backstage/catalog-client@1.6.1-next.0
  - @backstage/catalog-model@1.4.5-next.0

## 0.0.1

### Patch Changes

- 8472188: Added or fixed the `repository` field in `package.json`.
- fb8fc24: Initial notifications system for backstage
- Updated dependencies
  - @backstage/backend-common@0.21.0
  - @backstage/plugin-signals-node@0.0.1
  - @backstage/plugin-notifications-common@0.0.1
  - @backstage/backend-plugin-api@0.6.10
  - @backstage/catalog-model@1.4.4
  - @backstage/catalog-client@1.6.0

## 0.0.1-next.1

### Patch Changes

- 8472188: Added or fixed the `repository` field in `package.json`.
- Updated dependencies
  - @backstage/backend-common@0.21.0-next.3
  - @backstage/plugin-notifications-common@0.0.1-next.1
  - @backstage/plugin-signals-node@0.0.1-next.3
  - @backstage/backend-plugin-api@0.6.10-next.3
  - @backstage/catalog-client@1.6.0-next.1
  - @backstage/catalog-model@1.4.4-next.0

## 0.0.1-next.0

### Patch Changes

- fb8fc24: Initial notifications system for backstage
- Updated dependencies
  - @backstage/backend-common@0.21.0-next.2
  - @backstage/plugin-signals-node@0.0.1-next.2
  - @backstage/backend-plugin-api@0.6.10-next.2
  - @backstage/plugin-notifications-common@0.0.1-next.0
  - @backstage/catalog-client@1.6.0-next.1
  - @backstage/catalog-model@1.4.4-next.0
