# @backstage/plugin-catalog-backend-module-incremental-ingestion

## 0.1.1

### Patch Changes

- ecbec4ec4c: Internal refactor to match new options pattern in the experimental backend system.
- 045b66ce02: Fixed issue with sometimes trying to commit an empty array of references
- 9f2b786fc9: Provide context for logged errors.
- 8e06f3cf00: Switched imports of `loggerToWinstonLogger` to `@backstage/backend-common`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.3.0
  - @backstage/backend-common@0.18.0
  - @backstage/backend-test-utils@0.1.32
  - @backstage/catalog-model@1.1.5
  - @backstage/backend-tasks@0.4.1
  - @backstage/plugin-catalog-node@1.3.1
  - @backstage/plugin-catalog-backend@1.7.0
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/plugin-permission-common@0.7.3

## 0.1.1-next.2

### Patch Changes

- 9f2b786fc9: Provide context for logged errors.
- 8e06f3cf00: Switched imports of `loggerToWinstonLogger` to `@backstage/backend-common`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.3.0-next.1
  - @backstage/backend-test-utils@0.1.32-next.2
  - @backstage/backend-common@0.18.0-next.1
  - @backstage/backend-tasks@0.4.1-next.1
  - @backstage/plugin-catalog-backend@1.7.0-next.2
  - @backstage/plugin-catalog-node@1.3.1-next.2
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/config@1.0.6-next.0
  - @backstage/errors@1.1.4
  - @backstage/plugin-permission-common@0.7.3-next.0

## 0.1.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.2.1-next.0
  - @backstage/backend-test-utils@0.1.32-next.1
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/plugin-catalog-backend@1.7.0-next.1
  - @backstage/plugin-catalog-node@1.3.1-next.1
  - @backstage/backend-tasks@0.4.1-next.0
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/errors@1.1.4
  - @backstage/plugin-permission-common@0.7.3-next.0

## 0.1.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.5-next.0
  - @backstage/plugin-catalog-backend@1.7.0-next.0
  - @backstage/backend-common@0.17.0
  - @backstage/backend-plugin-api@0.2.0
  - @backstage/backend-tasks@0.4.0
  - @backstage/backend-test-utils@0.1.32-next.0
  - @backstage/config@1.0.5
  - @backstage/errors@1.1.4
  - @backstage/plugin-catalog-node@1.3.1-next.0
  - @backstage/plugin-permission-common@0.7.2

## 0.1.0

### Minor Changes

- 98c643a1a2: Introduces incremental entity providers, which are used for streaming very large data sources into the catalog.

### Patch Changes

- c507aee8a2: Ensured typescript type checks in migration files.
- 884d749b14: Refactored to use `coreServices` from `@backstage/backend-plugin-api`.
- de8a975911: Changed to use native `AbortController` and `AbortSignal` from Node.js, instead
  of the one from `node-abort-controller`. This is possible now that the minimum
  supported Node.js version of the project is 16.

  Note that their interfaces are very slightly different, but typically not in a
  way that matters to consumers. If you see any typescript errors as a direct
  result from this, they are compatible with each other in the ways that we
  interact with them, and should be possible to type-cast across without ill
  effects.

- 05a928e296: Updated usages of types from `@backstage/backend-plugin-api`.
- 61d4efe978: Make incremental providers more resilient to failures
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.6.0
  - @backstage/backend-common@0.17.0
  - @backstage/plugin-catalog-node@1.3.0
  - @backstage/backend-tasks@0.4.0
  - @backstage/plugin-permission-common@0.7.2
  - @backstage/backend-test-utils@0.1.31
  - @backstage/errors@1.1.4
  - @backstage/backend-plugin-api@0.2.0
  - @backstage/catalog-model@1.1.4
  - @backstage/config@1.0.5

## 0.1.0-next.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.6.0-next.3
  - @backstage/backend-tasks@0.4.0-next.3
  - @backstage/plugin-permission-common@0.7.2-next.2
  - @backstage/backend-common@0.17.0-next.3
  - @backstage/backend-plugin-api@0.2.0-next.3
  - @backstage/backend-test-utils@0.1.31-next.4
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/errors@1.1.4-next.1
  - @backstage/plugin-catalog-node@1.3.0-next.3

## 0.1.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.17.0-next.2
  - @backstage/backend-plugin-api@0.2.0-next.2
  - @backstage/backend-tasks@0.4.0-next.2
  - @backstage/backend-test-utils@0.1.31-next.3
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/errors@1.1.4-next.1
  - @backstage/plugin-catalog-backend@1.6.0-next.2
  - @backstage/plugin-catalog-node@1.3.0-next.2
  - @backstage/plugin-permission-common@0.7.2-next.1

## 0.1.0-next.1

### Patch Changes

- c507aee8a2: Ensured typescript type checks in migration files.
- 884d749b14: Refactored to use `coreServices` from `@backstage/backend-plugin-api`.
- 61d4efe978: Make incremental providers more resilient to failures
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.6.0-next.2
  - @backstage/plugin-catalog-node@1.3.0-next.2
  - @backstage/backend-common@0.17.0-next.2
  - @backstage/backend-plugin-api@0.2.0-next.2
  - @backstage/backend-test-utils@0.1.31-next.2
  - @backstage/backend-tasks@0.4.0-next.2
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/errors@1.1.4-next.1
  - @backstage/plugin-permission-common@0.7.2-next.1

## 0.1.0-next.0

### Minor Changes

- 98c643a1a2: Introduces incremental entity providers, which are used for streaming very large data sources into the catalog.

### Patch Changes

- de8a975911: Changed to use native `AbortController` and `AbortSignal` from Node.js, instead
  of the one from `node-abort-controller`. This is possible now that the minimum
  supported Node.js version of the project is 16.

  Note that their interfaces are very slightly different, but typically not in a
  way that matters to consumers. If you see any typescript errors as a direct
  result from this, they are compatible with each other in the ways that we
  interact with them, and should be possible to type-cast across without ill
  effects.

- Updated dependencies
  - @backstage/backend-common@0.17.0-next.1
  - @backstage/plugin-catalog-backend@1.6.0-next.1
  - @backstage/backend-tasks@0.4.0-next.1
  - @backstage/backend-plugin-api@0.1.5-next.1
  - @backstage/backend-test-utils@0.1.31-next.1
  - @backstage/plugin-catalog-node@1.2.2-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/errors@1.1.4-next.1
  - @backstage/plugin-permission-common@0.7.2-next.1
