# @backstage/plugin-periskop-backend

## 0.2.8-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.2
  - @backstage/backend-plugin-api@0.6.10-next.2
  - @backstage/config@1.1.1

## 0.2.8-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.10-next.1
  - @backstage/backend-common@0.21.0-next.1
  - @backstage/config@1.1.1

## 0.2.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.0
  - @backstage/backend-plugin-api@0.6.10-next.0
  - @backstage/config@1.1.1

## 0.2.7

### Patch Changes

- 4016f21: Remove some unused dependencies
- Updated dependencies
  - @backstage/backend-common@0.20.1
  - @backstage/backend-plugin-api@0.6.9
  - @backstage/config@1.1.1

## 0.2.7-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.9-next.2
  - @backstage/backend-common@0.20.1-next.2

## 0.2.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1-next.1
  - @backstage/config@1.1.1
  - @backstage/backend-plugin-api@0.6.9-next.1

## 0.2.7-next.0

### Patch Changes

- 4016f21: Remove some unused dependencies
- Updated dependencies
  - @backstage/backend-common@0.20.1-next.0
  - @backstage/backend-plugin-api@0.6.9-next.0
  - @backstage/config@1.1.1

## 0.2.6

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0
  - @backstage/backend-plugin-api@0.6.8
  - @backstage/config@1.1.1

## 0.2.6-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.3
  - @backstage/backend-plugin-api@0.6.8-next.3
  - @backstage/config@1.1.1

## 0.2.6-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.2
  - @backstage/backend-plugin-api@0.6.8-next.2
  - @backstage/config@1.1.1

## 0.2.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/config@1.1.1

## 0.2.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.0
  - @backstage/backend-plugin-api@0.6.8-next.0
  - @backstage/config@1.1.1

## 0.2.5

### Patch Changes

- 8613ba3928: Switched to using `"exports"` field for `/alpha` subpath export.
- Updated dependencies
  - @backstage/backend-common@0.19.9
  - @backstage/backend-plugin-api@0.6.7
  - @backstage/config@1.1.1

## 0.2.5-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.7-next.2
  - @backstage/backend-common@0.19.9-next.2

## 0.2.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.9-next.1
  - @backstage/backend-plugin-api@0.6.7-next.1
  - @backstage/config@1.1.1

## 0.2.5-next.0

### Patch Changes

- 8613ba3928: Switched to using `"exports"` field for `/alpha` subpath export.
- Updated dependencies
  - @backstage/backend-common@0.19.9-next.0
  - @backstage/backend-plugin-api@0.6.7-next.0
  - @backstage/config@1.1.1

## 0.2.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/config@1.1.1

## 0.2.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8-next.2
  - @backstage/backend-plugin-api@0.6.6-next.2
  - @backstage/config@1.1.1-next.0

## 0.2.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.7-next.1
  - @backstage/backend-plugin-api@0.6.5-next.1
  - @backstage/config@1.1.0

## 0.2.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.7-next.0
  - @backstage/config@1.1.0
  - @backstage/backend-plugin-api@0.6.5-next.0

## 0.2.0

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
  - @backstage/backend-common@0.19.5
  - @backstage/config@1.1.0
  - @backstage/backend-plugin-api@0.6.3

## 0.2.0-next.3

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
  - @backstage/config@1.1.0-next.2
  - @backstage/backend-plugin-api@0.6.3-next.3
  - @backstage/backend-common@0.19.5-next.3

## 0.1.22-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2

## 0.1.22-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.0
  - @backstage/backend-common@0.19.5-next.1
  - @backstage/backend-plugin-api@0.6.3-next.1

## 0.1.21-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.4-next.0
  - @backstage/backend-plugin-api@0.6.2-next.0
  - @backstage/config@1.0.8

## 0.1.19

### Patch Changes

- 629cbd194a87: Use `coreServices.rootConfig` instead of `coreService.config`
- 12a8c94eda8d: Add package repository and homepage metadata
- Updated dependencies
  - @backstage/backend-common@0.19.2
  - @backstage/backend-plugin-api@0.6.0
  - @backstage/config@1.0.8

## 0.1.19-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-common@0.19.2-next.2

## 0.1.19-next.1

### Patch Changes

- 629cbd194a87: Use `coreServices.rootConfig` instead of `coreService.config`
- 12a8c94eda8d: Add package repository and homepage metadata
- Updated dependencies
  - @backstage/backend-common@0.19.2-next.1
  - @backstage/backend-plugin-api@0.6.0-next.1
  - @backstage/config@1.0.8

## 0.1.19-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.2-next.0
  - @backstage/backend-plugin-api@0.5.5-next.0
  - @backstage/config@1.0.8

## 0.1.18

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.1
  - @backstage/backend-plugin-api@0.5.4
  - @backstage/config@1.0.8

## 0.1.18-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.1-next.0
  - @backstage/backend-plugin-api@0.5.4-next.0
  - @backstage/config@1.0.8

## 0.1.17

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0
  - @backstage/backend-plugin-api@0.5.3
  - @backstage/config@1.0.8

## 0.1.17-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0-next.2
  - @backstage/backend-plugin-api@0.5.3-next.2
  - @backstage/config@1.0.7

## 0.1.17-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0-next.1
  - @backstage/backend-plugin-api@0.5.3-next.1
  - @backstage/config@1.0.7

## 0.1.17-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.6-next.0
  - @backstage/config@1.0.7
  - @backstage/backend-plugin-api@0.5.3-next.0

## 0.1.16

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5
  - @backstage/backend-plugin-api@0.5.2
  - @backstage/config@1.0.7

## 0.1.16-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/backend-plugin-api@0.5.2-next.1
  - @backstage/config@1.0.7

## 0.1.16-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.0
  - @backstage/backend-plugin-api@0.5.2-next.0
  - @backstage/config@1.0.7

## 0.1.15

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.4
  - @backstage/backend-plugin-api@0.5.1
  - @backstage/config@1.0.7

## 0.1.15-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.4-next.2
  - @backstage/backend-plugin-api@0.5.1-next.2
  - @backstage/config@1.0.7

## 0.1.15-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.4-next.1
  - @backstage/backend-plugin-api@0.5.1-next.1
  - @backstage/config@1.0.7

## 0.1.15-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.4-next.0
  - @backstage/config@1.0.7
  - @backstage/backend-plugin-api@0.5.1-next.0

## 0.1.14

### Patch Changes

- 52b0022dab7: Updated dependency `msw` to `^1.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.18.3
  - @backstage/backend-plugin-api@0.5.0
  - @backstage/config@1.0.7

## 0.1.14-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.3-next.2
  - @backstage/backend-plugin-api@0.4.1-next.2
  - @backstage/config@1.0.7-next.0

## 0.1.14-next.1

### Patch Changes

- 52b0022dab7: Updated dependency `msw` to `^1.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.18.3-next.1
  - @backstage/backend-plugin-api@0.4.1-next.1
  - @backstage/config@1.0.7-next.0

## 0.1.14-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.4.1-next.0
  - @backstage/backend-common@0.18.3-next.0
  - @backstage/config@1.0.6

## 0.1.13

### Patch Changes

- 0ff03319be: Updated usage of `createBackendPlugin`.
- 4a6f38a535: Added a Backend System plugin feature
- Updated dependencies
  - @backstage/backend-plugin-api@0.4.0
  - @backstage/backend-common@0.18.2
  - @backstage/config@1.0.6

## 0.1.13-next.2

### Patch Changes

- 0ff03319be: Updated usage of `createBackendPlugin`.
- 4a6f38a535: Added a Backend System plugin feature
- Updated dependencies
  - @backstage/backend-plugin-api@0.4.0-next.2
  - @backstage/backend-common@0.18.2-next.2
  - @backstage/config@1.0.6

## 0.1.13-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.2-next.1
  - @backstage/config@1.0.6

## 0.1.13-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.2-next.0

## 0.1.11

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.0
  - @backstage/config@1.0.6

## 0.1.11-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.0-next.1
  - @backstage/config@1.0.6-next.0

## 0.1.11-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0

## 0.1.10

### Patch Changes

- 3280711113: Updated dependency `msw` to `^0.49.0`.
- Updated dependencies
  - @backstage/backend-common@0.17.0
  - @backstage/config@1.0.5

## 0.1.10-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.17.0-next.3
  - @backstage/config@1.0.5-next.1

## 0.1.10-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.17.0-next.2
  - @backstage/config@1.0.5-next.1

## 0.1.10-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.17.0-next.1
  - @backstage/config@1.0.5-next.1

## 0.1.10-next.0

### Patch Changes

- 3280711113: Updated dependency `msw` to `^0.49.0`.
- Updated dependencies
  - @backstage/backend-common@0.16.1-next.0
  - @backstage/config@1.0.5-next.0

## 0.1.9

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.16.0
  - @backstage/config@1.0.4

## 0.1.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.16.0-next.1
  - @backstage/config@1.0.4-next.0

## 0.1.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.16.0-next.0
  - @backstage/config@1.0.4-next.0

## 0.1.8

### Patch Changes

- 2d3a5f09ab: Use `response.json` rather than `response.send` where appropriate, as outlined in `SECURITY.md`
- Updated dependencies
  - @backstage/backend-common@0.15.2
  - @backstage/config@1.0.3

## 0.1.8-next.2

### Patch Changes

- 2d3a5f09ab: Use `response.json` rather than `response.send` where appropriate, as outlined in `SECURITY.md`
- Updated dependencies
  - @backstage/backend-common@0.15.2-next.2
  - @backstage/config@1.0.3-next.2

## 0.1.8-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.2-next.1
  - @backstage/config@1.0.3-next.1

## 0.1.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.2-next.0
  - @backstage/config@1.0.3-next.0

## 0.1.7

### Patch Changes

- 148568b5c2: Switched to using node-fetch instead of cross-fetch as is standard for our backend packages
- 667d917488: Updated dependency `msw` to `^0.47.0`.
- 87ec2ba4d6: Updated dependency `msw` to `^0.46.0`.
- bf5e9030eb: Updated dependency `msw` to `^0.45.0`.
- Updated dependencies
  - @backstage/backend-common@0.15.1
  - @backstage/config@1.0.2

## 0.1.7-next.3

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.2-next.0
  - @backstage/backend-common@0.15.1-next.3

## 0.1.7-next.2

### Patch Changes

- 667d917488: Updated dependency `msw` to `^0.47.0`.
- 87ec2ba4d6: Updated dependency `msw` to `^0.46.0`.
- Updated dependencies
  - @backstage/backend-common@0.15.1-next.2

## 0.1.7-next.1

### Patch Changes

- 148568b5c2: Switched to using node-fetch instead of cross-fetch as is standard for our backend packages
- Updated dependencies
  - @backstage/backend-common@0.15.1-next.1

## 0.1.7-next.0

### Patch Changes

- bf5e9030eb: Updated dependency `msw` to `^0.45.0`.
- Updated dependencies
  - @backstage/backend-common@0.15.1-next.0

## 0.1.6

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.0

## 0.1.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.0-next.0

## 0.1.5

### Patch Changes

- a70869e775: Updated dependency `msw` to `^0.43.0`.
- 8006d0f9bf: Updated dependency `msw` to `^0.44.0`.
- Updated dependencies
  - @backstage/backend-common@0.14.1

## 0.1.5-next.1

### Patch Changes

- a70869e775: Updated dependency `msw` to `^0.43.0`.
- Updated dependencies
  - @backstage/backend-common@0.14.1-next.3

## 0.1.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.14.1-next.0

## 0.1.4

### Patch Changes

- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- Updated dependencies
  - @backstage/backend-common@0.14.0

## 0.1.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.14.0-next.2

## 0.1.4-next.1

### Patch Changes

- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- Updated dependencies
  - @backstage/backend-common@0.13.6-next.1

## 0.1.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.6-next.0

## 0.1.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.3
  - @backstage/config@1.0.1

## 0.1.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.3-next.2
  - @backstage/config@1.0.1-next.0

## 0.1.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.3-next.0

## 0.1.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.2

## 0.1.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.2-next.0

## 0.1.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.1
  - @backstage/config@1.0.0

## 0.1.0

### Minor Changes

- 7ef026339d: Add periskop and periskop-backend plugin, for usage with exception aggregation tool https://periskop.io/

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.0

## 0.1.0-next.0

### Minor Changes

- 7ef026339d: Add periskop and periskop-backend plugin, for usage with exception aggregation tool https://periskop.io/

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.0-next.0
