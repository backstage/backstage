# @backstage/plugin-vault-backend

## 0.2.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.3.6-next.2
  - @backstage/backend-common@0.15.2-next.2
  - @backstage/backend-test-utils@0.1.29-next.2
  - @backstage/config@1.0.3-next.2
  - @backstage/errors@1.1.2-next.2

## 0.2.3-next.1

### Patch Changes

- dae0bbe522: VaultBuilder.tsx renamed to VaultBuilder in order for module to be correctly loaded.
- Updated dependencies
  - @backstage/backend-common@0.15.2-next.1
  - @backstage/backend-tasks@0.3.6-next.1
  - @backstage/backend-test-utils@0.1.29-next.1
  - @backstage/config@1.0.3-next.1
  - @backstage/errors@1.1.2-next.1

## 0.2.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-test-utils@0.1.29-next.0
  - @backstage/backend-common@0.15.2-next.0
  - @backstage/backend-tasks@0.3.6-next.0
  - @backstage/config@1.0.3-next.0
  - @backstage/errors@1.1.2-next.0

## 0.2.2

### Patch Changes

- 3f739be9d9: Minor API signatures cleanup
- 148568b5c2: Switched to using node-fetch instead of cross-fetch as is standard for our backend packages
- 60b85d8ade: Updated dependency `helmet` to `^6.0.0`.

  Please note that these policies are no longer applied by default:

  helmet.contentSecurityPolicy no longer sets block-all-mixed-content directive by default
  helmet.expectCt is no longer set by default. It can, however, be explicitly enabled. It will be removed in Helmet 7.

- 667d917488: Updated dependency `msw` to `^0.47.0`.
- 87ec2ba4d6: Updated dependency `msw` to `^0.46.0`.
- bf5e9030eb: Updated dependency `msw` to `^0.45.0`.
- Updated dependencies
  - @backstage/backend-common@0.15.1
  - @backstage/backend-tasks@0.3.5
  - @backstage/config@1.0.2
  - @backstage/errors@1.1.1
  - @backstage/backend-test-utils@0.1.28

## 0.2.2-next.3

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.2-next.0
  - @backstage/errors@1.1.1-next.0
  - @backstage/backend-test-utils@0.1.28-next.3
  - @backstage/backend-common@0.15.1-next.3
  - @backstage/backend-tasks@0.3.5-next.1

## 0.2.2-next.2

### Patch Changes

- 667d917488: Updated dependency `msw` to `^0.47.0`.
- 87ec2ba4d6: Updated dependency `msw` to `^0.46.0`.
- Updated dependencies
  - @backstage/backend-common@0.15.1-next.2
  - @backstage/backend-test-utils@0.1.28-next.2

## 0.2.2-next.1

### Patch Changes

- 148568b5c2: Switched to using node-fetch instead of cross-fetch as is standard for our backend packages
- 60b85d8ade: Updated dependency `helmet` to `^6.0.0`.

  Please note that these policies are no longer applied by default:

  helmet.contentSecurityPolicy no longer sets block-all-mixed-content directive by default
  helmet.expectCt is no longer set by default. It can, however, be explicitly enabled. It will be removed in Helmet 7.

- Updated dependencies
  - @backstage/backend-common@0.15.1-next.1
  - @backstage/backend-test-utils@0.1.28-next.1

## 0.2.2-next.0

### Patch Changes

- 3f739be9d9: Minor API signatures cleanup
- bf5e9030eb: Updated dependency `msw` to `^0.45.0`.
- Updated dependencies
  - @backstage/backend-common@0.15.1-next.0
  - @backstage/backend-tasks@0.3.5-next.0
  - @backstage/backend-test-utils@0.1.28-next.0

## 0.2.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.0
  - @backstage/backend-test-utils@0.1.27
  - @backstage/backend-tasks@0.3.4

## 0.2.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.0-next.0
  - @backstage/backend-tasks@0.3.4-next.0
  - @backstage/backend-test-utils@0.1.27-next.0

## 0.2.0

### Minor Changes

- 5ebf2c7023: Throw exceptions instead of swallow them, remove some exported types from the `api-report`, small changes in the API responses & expose the vault `baseUrl` to the frontend as well

### Patch Changes

- 7ee4abdcc9: Added a path notion in addition to secret name to allow to differentiate secrets in sub-paths
- a70869e775: Updated dependency `msw` to `^0.43.0`.
- 8006d0f9bf: Updated dependency `msw` to `^0.44.0`.
- Updated dependencies
  - @backstage/backend-common@0.14.1
  - @backstage/backend-test-utils@0.1.26
  - @backstage/backend-tasks@0.3.3
  - @backstage/errors@1.1.0

## 0.2.0-next.3

### Patch Changes

- a70869e775: Updated dependency `msw` to `^0.43.0`.
- Updated dependencies
  - @backstage/backend-common@0.14.1-next.3
  - @backstage/backend-test-utils@0.1.26-next.3
  - @backstage/backend-tasks@0.3.3-next.3

## 0.2.0-next.2

### Patch Changes

- 7ee4abdcc9: Added a path notion in addition to secret name to allow to differentiate secrets in sub-paths
- Updated dependencies
  - @backstage/backend-common@0.14.1-next.2
  - @backstage/backend-tasks@0.3.3-next.2
  - @backstage/backend-test-utils@0.1.26-next.2

## 0.2.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.14.1-next.1
  - @backstage/errors@1.1.0-next.0
  - @backstage/backend-tasks@0.3.3-next.1
  - @backstage/backend-test-utils@0.1.26-next.1

## 0.2.0-next.0

### Minor Changes

- 5ebf2c7023: Throw exceptions instead of swallow them, remove some exported types from the `api-report`, small changes in the API responses & expose the vault `baseUrl` to the frontend as well

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.14.1-next.0
  - @backstage/backend-tasks@0.3.3-next.0
  - @backstage/backend-test-utils@0.1.26-next.0

## 0.1.0

### Minor Changes

- 7c310a5bc2: First implementation for the backend vault plugin. For more information refer to its `README.md`.

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.3.2
  - @backstage/backend-common@0.14.0
  - @backstage/backend-test-utils@0.1.25
