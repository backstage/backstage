# @backstage/plugin-catalog-backend-module-unprocessed

## 0.3.0

### Minor Changes

- 71114ac50e02: **BREAKING**: The export for the new backend system has been moved to be the `default` export.

  For example, if you are currently importing the plugin using the following pattern:

  ```ts
  import { examplePlugin } from '@backstage/plugin-example-backend';

  backend.add(examplePlugin);
  ```

  It should be migrated to this:

  ```ts
  backend.add(import('@backstage/plugin-example-backend'));
  ```

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.3.0
  - @backstage/catalog-model@1.4.2
  - @backstage/backend-plugin-api@0.6.3

## 0.3.0-next.3

### Minor Changes

- 71114ac50e02: **BREAKING**: The export for the new backend system has been moved to be the `default` export.

  For example, if you are currently importing the plugin using the following pattern:

  ```ts
  import { examplePlugin } from '@backstage/plugin-example-backend';

  backend.add(examplePlugin);
  ```

  It should be migrated to this:

  ```ts
  backend.add(import('@backstage/plugin-example-backend'));
  ```

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.4.2-next.2
  - @backstage/backend-plugin-api@0.6.3-next.3
  - @backstage/plugin-auth-node@0.3.0-next.3

## 0.2.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.3.0-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/catalog-model@1.4.2-next.1

## 0.2.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.3-next.1
  - @backstage/catalog-model@1.4.2-next.0
  - @backstage/plugin-auth-node@0.3.0-next.1

## 0.2.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.3.0-next.0
  - @backstage/backend-plugin-api@0.6.2-next.0
  - @backstage/catalog-model@1.4.1

## 0.2.0

### Minor Changes

- 5156a94c2e2a: **BREAKING**: Fixing typo in exported module. You will have to rename the import to the correct spelling. `UnprocessedEntites` -> `UnprocessedEntities`

### Patch Changes

- 12a8c94eda8d: Add package repository and homepage metadata
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0
  - @backstage/plugin-auth-node@0.2.17
  - @backstage/catalog-model@1.4.1

## 0.2.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/plugin-auth-node@0.2.17-next.2

## 0.2.0-next.1

### Patch Changes

- 12a8c94eda8d: Add package repository and homepage metadata
- Updated dependencies
  - @backstage/plugin-auth-node@0.2.17-next.1
  - @backstage/backend-plugin-api@0.6.0-next.1
  - @backstage/catalog-model@1.4.1

## 0.2.0-next.0

### Minor Changes

- 5156a94c2e2a: **BREAKING**: Fixing typo in exported module. You will have to rename the import to the correct spelling. `UnprocessedEntites` -> `UnprocessedEntities`

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.5.5-next.0
  - @backstage/catalog-model@1.4.1
  - @backstage/plugin-auth-node@0.2.17-next.0

## 0.1.1

### Patch Changes

- a8fa79ccc105: Fix and improve documentation for the unprocessed entities modules.
- Updated dependencies
  - @backstage/backend-plugin-api@0.5.4
  - @backstage/catalog-model@1.4.1
  - @backstage/plugin-auth-node@0.2.16

## 0.1.1-next.0

### Patch Changes

- a8fa79ccc105: Fix and improve documentation for the unprocessed entities modules.
- Updated dependencies
  - @backstage/backend-plugin-api@0.5.4-next.0
  - @backstage/catalog-model@1.4.1-next.0
  - @backstage/plugin-auth-node@0.2.16-next.0

## 0.1.0

### Minor Changes

- d44fcd9829c2: Added a new plugin to expose entities which are unprocessed or have errors processing

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.4.0
  - @backstage/backend-plugin-api@0.5.3
  - @backstage/plugin-auth-node@0.2.15

## 0.1.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.4.0-next.1
  - @backstage/backend-plugin-api@0.5.3-next.2
  - @backstage/plugin-auth-node@0.2.15-next.2

## 0.1.0-next.0

### Minor Changes

- d44fcd9829c2: Added a new plugin to expose entities which are unprocessed or have errors processing

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.5.3-next.1
  - @backstage/catalog-model@1.4.0-next.0
  - @backstage/plugin-auth-node@0.2.15-next.1
