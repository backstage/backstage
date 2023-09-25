# @backstage/plugin-auth-backend-module-gcp-iap-provider

## 0.1.0

### Minor Changes

- 8513cd7d00e3: New module for `@backstage/plugin-auth-backend` that adds a GCP IAP auth provider.

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
  - @backstage/plugin-auth-node@0.3.0
  - @backstage/errors@1.2.2
  - @backstage/types@1.1.1
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
  - @backstage/errors@1.2.2-next.0
  - @backstage/types@1.1.1-next.0
  - @backstage/backend-plugin-api@0.6.3-next.3
  - @backstage/plugin-auth-node@0.3.0-next.3

## 0.1.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.3.0-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0

## 0.1.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.3-next.1
  - @backstage/plugin-auth-node@0.3.0-next.1
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0

## 0.1.0-next.0

### Minor Changes

- 8513cd7d00e3: New module for `@backstage/plugin-auth-backend` that adds a GCP IAP auth provider.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.3.0-next.0
  - @backstage/backend-plugin-api@0.6.2-next.0
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0
