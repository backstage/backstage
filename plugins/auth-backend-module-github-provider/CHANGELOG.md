# @backstage/plugin-auth-backend-module-github-provider

## 0.1.7-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.10-next.2
  - @backstage/plugin-auth-node@0.4.4-next.2

## 0.1.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.10-next.1
  - @backstage/plugin-auth-node@0.4.4-next.1

## 0.1.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.4.4-next.0
  - @backstage/backend-plugin-api@0.6.10-next.0

## 0.1.6

### Patch Changes

- 4016f21: Remove some unused dependencies
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.9
  - @backstage/plugin-auth-node@0.4.3

## 0.1.6-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.9-next.2
  - @backstage/plugin-auth-node@0.4.3-next.2

## 0.1.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.4.3-next.1
  - @backstage/backend-plugin-api@0.6.9-next.1

## 0.1.6-next.0

### Patch Changes

- 4016f21: Remove some unused dependencies
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.9-next.0
  - @backstage/plugin-auth-node@0.4.3-next.0

## 0.1.5

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0
  - @backstage/plugin-auth-node@0.4.2
  - @backstage/backend-plugin-api@0.6.8

## 0.1.5-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.3
  - @backstage/backend-plugin-api@0.6.8-next.3
  - @backstage/plugin-auth-node@0.4.2-next.3

## 0.1.5-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.2
  - @backstage/plugin-auth-node@0.4.2-next.2
  - @backstage/backend-plugin-api@0.6.8-next.2

## 0.1.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/plugin-auth-node@0.4.2-next.1

## 0.1.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.0
  - @backstage/plugin-auth-node@0.4.2-next.0
  - @backstage/backend-plugin-api@0.6.8-next.0

## 0.1.4

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.9
  - @backstage/backend-plugin-api@0.6.7
  - @backstage/plugin-auth-node@0.4.1

## 0.1.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.7-next.2
  - @backstage/backend-common@0.19.9-next.2
  - @backstage/plugin-auth-node@0.4.1-next.2

## 0.1.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.9-next.1
  - @backstage/plugin-auth-node@0.4.1-next.1
  - @backstage/backend-plugin-api@0.6.7-next.1

## 0.1.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.9-next.0
  - @backstage/backend-plugin-api@0.6.7-next.0
  - @backstage/plugin-auth-node@0.4.1-next.0

## 0.1.3

### Patch Changes

- 5d32a58b5a: Fixed a bug where the GitHub authenticator did not properly persist granted OAuth scopes.
- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/plugin-auth-node@0.4.0
  - @backstage/backend-plugin-api@0.6.6

## 0.1.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8-next.2
  - @backstage/plugin-auth-node@0.4.0-next.2
  - @backstage/backend-plugin-api@0.6.6-next.2

## 0.1.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.7-next.1
  - @backstage/backend-plugin-api@0.6.5-next.1
  - @backstage/plugin-auth-node@0.3.2-next.1

## 0.1.2-next.0

### Patch Changes

- 5d32a58b5a: Fixed a bug where the GitHub authenticator did not properly persist granted OAuth scopes.
- Updated dependencies
  - @backstage/plugin-auth-node@0.3.2-next.0
  - @backstage/backend-common@0.19.7-next.0
  - @backstage/backend-plugin-api@0.6.5-next.0

## 0.1.0

### Minor Changes

- 23af27f5ce79: New module for `@backstage/plugin-auth-backend` that adds a GitHub auth provider.

### Patch Changes

- 71114ac50e02: The export for the new backend system has been moved to be the `default` export.

  For example, if you are currently importing the plugin using the following pattern:

  ```ts
  import { examplePlugin } from '@backstage/plugin-example-backend';

  backend.add(examplePlugin);
  ```

  It should be migrated to this:

  ```ts
  backend.add(import('@backstage/plugin-example-backend'));
  ```

- Updated dependencies
  - @backstage/backend-common@0.19.5
  - @backstage/plugin-auth-node@0.3.0
  - @backstage/backend-plugin-api@0.6.3

## 0.1.0-next.3

### Patch Changes

- 71114ac50e02: The export for the new backend system has been moved to be the `default` export.

  For example, if you are currently importing the plugin using the following pattern:

  ```ts
  import { examplePlugin } from '@backstage/plugin-example-backend';

  backend.add(examplePlugin);
  ```

  It should be migrated to this:

  ```ts
  backend.add(import('@backstage/plugin-example-backend'));
  ```

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.3-next.3
  - @backstage/backend-common@0.19.5-next.3
  - @backstage/plugin-auth-node@0.3.0-next.3

## 0.1.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/plugin-auth-node@0.3.0-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2

## 0.1.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.5-next.1
  - @backstage/backend-plugin-api@0.6.3-next.1
  - @backstage/plugin-auth-node@0.3.0-next.1

## 0.1.0-next.0

### Minor Changes

- 23af27f5ce79: New module for `@backstage/plugin-auth-backend` that adds a GitHub auth provider.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.3.0-next.0
  - @backstage/backend-common@0.19.4-next.0
  - @backstage/backend-plugin-api@0.6.2-next.0
