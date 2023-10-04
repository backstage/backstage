# @backstage/plugin-permission-backend-module-allow-all-policy

## 0.1.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.3.2
  - @backstage/backend-plugin-api@0.6.5
  - @backstage/plugin-permission-node@0.7.16
  - @backstage/backend-common@0.19.7

## 0.1.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.3.1
  - @backstage/backend-plugin-api@0.6.4
  - @backstage/plugin-permission-node@0.7.15
  - @backstage/backend-common@0.19.6

## 0.1.0

### Minor Changes

- 5f7b2153526b: Created package with policy `permissionModuleAllowAllPolicy`

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
  - @backstage/plugin-permission-common@0.7.8
  - @backstage/plugin-permission-node@0.7.14
  - @backstage/backend-plugin-api@0.6.3

## 0.1.0-next.1

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
  - @backstage/plugin-permission-common@0.7.8-next.2
  - @backstage/plugin-permission-node@0.7.14-next.3
  - @backstage/backend-plugin-api@0.6.3-next.3
  - @backstage/backend-common@0.19.5-next.3
  - @backstage/plugin-auth-node@0.3.0-next.3

## 0.1.0-next.0

### Minor Changes

- 5f7b2153526b: Created package with policy `permissionModuleAllowAllPolicy`

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/plugin-auth-node@0.3.0-next.2
  - @backstage/plugin-permission-node@0.7.14-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/plugin-permission-common@0.7.8-next.1
