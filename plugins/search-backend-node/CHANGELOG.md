# @backstage/plugin-search-backend-node

## 1.3.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.5.0-next.2
  - @backstage/backend-plugin-api@1.0.0-next.2
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-search-common@1.2.14

## 1.3.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.5.0-next.1
  - @backstage/backend-plugin-api@0.9.0-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-search-common@1.2.14

## 1.3.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.9.0-next.0
  - @backstage/backend-defaults@0.5.0-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-search-common@1.2.14

## 1.3.0

### Minor Changes

- fc24d9e: Stop using `@backstage/backend-tasks` as it will be deleted in near future.

### Patch Changes

- 389f5a4: Update deprecated url-reader-related imports.
- 3123c16: Fix package metadata
- 7c5f3b0: Explicit declare if the service ref accepts `single` or `multiple` implementations.
- Updated dependencies
  - @backstage/backend-defaults@0.4.2
  - @backstage/backend-plugin-api@0.8.0
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-search-common@1.2.14
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 1.2.28-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.3
  - @backstage/backend-common@0.23.4-next.3
  - @backstage/backend-tasks@0.5.28-next.3
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-permission-common@0.8.1-next.1
  - @backstage/plugin-search-common@1.2.14-next.1

## 1.2.28-next.2

### Patch Changes

- 3123c16: Fix package metadata
- 7c5f3b0: Explicit declare if the service ref accepts `single` or `multiple` implementations.
- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.2
  - @backstage/plugin-permission-common@0.8.1-next.1
  - @backstage/backend-common@0.23.4-next.2
  - @backstage/plugin-search-common@1.2.14-next.1
  - @backstage/backend-tasks@0.5.28-next.2
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 1.2.28-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.8.1-next.0
  - @backstage/backend-plugin-api@0.7.1-next.1
  - @backstage/backend-common@0.23.4-next.1
  - @backstage/plugin-search-common@1.2.14-next.0
  - @backstage/backend-tasks@0.5.28-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 1.2.28-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.23.4-next.0
  - @backstage/backend-plugin-api@0.7.1-next.0
  - @backstage/backend-tasks@0.5.28-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-permission-common@0.8.0
  - @backstage/plugin-search-common@1.2.13

## 1.2.27

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.7.0
  - @backstage/backend-common@0.23.3
  - @backstage/backend-tasks@0.5.27
  - @backstage/plugin-permission-common@0.8.0
  - @backstage/plugin-search-common@1.2.13
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 1.2.27-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.23.3-next.1
  - @backstage/backend-plugin-api@0.6.22-next.1
  - @backstage/backend-tasks@0.5.27-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-permission-common@0.7.14
  - @backstage/plugin-search-common@1.2.12

## 1.2.26-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.21-next.0
  - @backstage/backend-common@0.23.2-next.0
  - @backstage/backend-tasks@0.5.26-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-permission-common@0.7.14
  - @backstage/plugin-search-common@1.2.12

## 1.2.24

### Patch Changes

- 6a576dc: Replace the usage of `getVoidLogger` with `mockServices.logger.mock` in order to remove the dependency with the soon-to-be-deprecated `backend-common` package.
- d44a20a: Added additional plugin metadata to `package.json`.
- 5b6f979: Split backend search plugin startup into "init" and "start" stages to ensure necessary initialization has happened before startup
- Updated dependencies
  - @backstage/backend-common@0.23.0
  - @backstage/backend-plugin-api@0.6.19
  - @backstage/backend-tasks@0.5.24
  - @backstage/plugin-permission-common@0.7.14
  - @backstage/plugin-search-common@1.2.12
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 1.2.24-next.3

### Patch Changes

- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.3
  - @backstage/plugin-permission-common@0.7.14-next.0
  - @backstage/plugin-search-common@1.2.12-next.0
  - @backstage/backend-tasks@0.5.24-next.3
  - @backstage/backend-common@0.23.0-next.3
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 1.2.24-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.2
  - @backstage/backend-common@0.23.0-next.2
  - @backstage/backend-tasks@0.5.24-next.2
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-permission-common@0.7.13
  - @backstage/plugin-search-common@1.2.11

## 1.2.24-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.24-next.1
  - @backstage/backend-plugin-api@0.6.19-next.1
  - @backstage/backend-common@0.23.0-next.1

## 1.2.24-next.0

### Patch Changes

- 6a576dc: Replace the usage of `getVoidLogger` with `mockServices.logger.mock` in order to remove the dependency with the soon-to-be-deprecated `backend-common` package.
- 5b6f979: Split backend search plugin startup into "init" and "start" stages to ensure necessary initialization has happened before startup
- Updated dependencies
  - @backstage/backend-tasks@0.5.24-next.0
  - @backstage/backend-common@0.22.1-next.0
  - @backstage/backend-plugin-api@0.6.19-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-permission-common@0.7.13
  - @backstage/plugin-search-common@1.2.11

## 1.2.22

### Patch Changes

- c6cb568: Add lifecycle monitoring for the search index registry
- Updated dependencies
  - @backstage/backend-common@0.22.0
  - @backstage/backend-plugin-api@0.6.18
  - @backstage/backend-tasks@0.5.23

## 1.2.22-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.22.0-next.1
  - @backstage/backend-tasks@0.5.23-next.1
  - @backstage/backend-plugin-api@0.6.18-next.1

## 1.2.22-next.0

### Patch Changes

- c6cb568: Add lifecycle monitoring for the search index registry
- Updated dependencies
  - @backstage/backend-common@0.21.8-next.0
  - @backstage/backend-plugin-api@0.6.18-next.0
  - @backstage/backend-tasks@0.5.23-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-permission-common@0.7.13
  - @backstage/plugin-search-common@1.2.11

## 1.2.21

### Patch Changes

- d5a1fe1: Replaced winston logger with `LoggerService`
- Updated dependencies
  - @backstage/backend-common@0.21.7
  - @backstage/backend-plugin-api@0.6.17
  - @backstage/backend-tasks@0.5.22
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-permission-common@0.7.13
  - @backstage/plugin-search-common@1.2.11

## 1.2.21-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.7-next.1
  - @backstage/backend-plugin-api@0.6.17-next.1
  - @backstage/backend-tasks@0.5.22-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-permission-common@0.7.13
  - @backstage/plugin-search-common@1.2.11

## 1.2.21-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.7-next.0
  - @backstage/backend-plugin-api@0.6.17-next.0
  - @backstage/backend-tasks@0.5.22-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-permission-common@0.7.13
  - @backstage/plugin-search-common@1.2.11

## 1.2.20

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.6
  - @backstage/backend-plugin-api@0.6.16
  - @backstage/backend-tasks@0.5.21
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-permission-common@0.7.13
  - @backstage/plugin-search-common@1.2.11

## 1.2.19

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.5
  - @backstage/backend-tasks@0.5.20
  - @backstage/backend-plugin-api@0.6.15
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-permission-common@0.7.13
  - @backstage/plugin-search-common@1.2.11

## 1.2.18

### Patch Changes

- 0fb419b: Updated dependency `uuid` to `^9.0.0`.
  Updated dependency `@types/uuid` to `^9.0.0`.
- 744c0cb: Exports `QueryTranslator`, `QueryRequestOptions` and `SearchEngine` types. These new types were extracted from the `@backstage/plugin-search-common` package and the `token` property was deprecated in favor of the a new credentials one.
- Updated dependencies
  - @backstage/backend-common@0.21.4
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/backend-plugin-api@0.6.14
  - @backstage/plugin-permission-common@0.7.13
  - @backstage/plugin-search-common@1.2.11
  - @backstage/backend-tasks@0.5.19

## 1.2.18-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.4-next.2
  - @backstage/backend-plugin-api@0.6.14-next.2
  - @backstage/backend-tasks@0.5.19-next.2
  - @backstage/config@1.2.0-next.1
  - @backstage/errors@1.2.4-next.0
  - @backstage/plugin-permission-common@0.7.13-next.1
  - @backstage/plugin-search-common@1.2.11-next.1

## 1.2.18-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/backend-tasks@0.5.19-next.1
  - @backstage/plugin-permission-common@0.7.13-next.1
  - @backstage/errors@1.2.4-next.0
  - @backstage/plugin-search-common@1.2.11-next.1

## 1.2.17-next.0

### Patch Changes

- 0fb419b: Updated dependency `uuid` to `^9.0.0`.
  Updated dependency `@types/uuid` to `^9.0.0`.
- 744c0cb: Exports `QueryTranslator`, `QueryRequestOptions` and `SearchEngine` types. These new types were extracted from the `@backstage/plugin-search-common` package and the `token` property was deprecated in favor of the a new credentials one.
- Updated dependencies
  - @backstage/backend-common@0.21.3-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/backend-plugin-api@0.6.13-next.0
  - @backstage/plugin-permission-common@0.7.13-next.0
  - @backstage/plugin-search-common@1.2.11-next.0
  - @backstage/backend-tasks@0.5.18-next.0
  - @backstage/config@1.1.2-next.0

## 1.2.14

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0
  - @backstage/backend-plugin-api@0.6.10
  - @backstage/backend-tasks@0.5.15
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-permission-common@0.7.12
  - @backstage/plugin-search-common@1.2.10

## 1.2.14-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.3
  - @backstage/backend-tasks@0.5.15-next.3
  - @backstage/backend-plugin-api@0.6.10-next.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-permission-common@0.7.12
  - @backstage/plugin-search-common@1.2.10

## 1.2.14-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.2
  - @backstage/backend-plugin-api@0.6.10-next.2
  - @backstage/backend-tasks@0.5.15-next.2
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-permission-common@0.7.12
  - @backstage/plugin-search-common@1.2.10

## 1.2.14-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.10-next.1
  - @backstage/backend-common@0.21.0-next.1
  - @backstage/backend-tasks@0.5.15-next.1
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-permission-common@0.7.12
  - @backstage/plugin-search-common@1.2.10

## 1.2.14-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.0
  - @backstage/backend-tasks@0.5.15-next.0
  - @backstage/backend-plugin-api@0.6.10-next.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-permission-common@0.7.12
  - @backstage/plugin-search-common@1.2.10

## 1.2.13

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1
  - @backstage/backend-plugin-api@0.6.9
  - @backstage/plugin-permission-common@0.7.12
  - @backstage/backend-tasks@0.5.14
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-search-common@1.2.10

## 1.2.13-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.9-next.2
  - @backstage/backend-common@0.20.1-next.2
  - @backstage/backend-tasks@0.5.14-next.2

## 1.2.13-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1-next.1
  - @backstage/config@1.1.1
  - @backstage/backend-tasks@0.5.14-next.1
  - @backstage/backend-plugin-api@0.6.9-next.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-permission-common@0.7.11
  - @backstage/plugin-search-common@1.2.9

## 1.2.13-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1-next.0
  - @backstage/backend-plugin-api@0.6.9-next.0
  - @backstage/backend-tasks@0.5.14-next.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-permission-common@0.7.11
  - @backstage/plugin-search-common@1.2.9

## 1.2.12

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0
  - @backstage/backend-tasks@0.5.13
  - @backstage/plugin-permission-common@0.7.11
  - @backstage/backend-plugin-api@0.6.8
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-search-common@1.2.9

## 1.2.12-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.3
  - @backstage/backend-plugin-api@0.6.8-next.3
  - @backstage/backend-tasks@0.5.13-next.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-permission-common@0.7.10
  - @backstage/plugin-search-common@1.2.8

## 1.2.12-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.2
  - @backstage/backend-plugin-api@0.6.8-next.2
  - @backstage/backend-tasks@0.5.13-next.2
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-permission-common@0.7.10
  - @backstage/plugin-search-common@1.2.8

## 1.2.12-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/backend-tasks@0.5.13-next.1
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-permission-common@0.7.10
  - @backstage/plugin-search-common@1.2.8

## 1.2.12-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.0
  - @backstage/backend-tasks@0.5.13-next.0
  - @backstage/backend-plugin-api@0.6.8-next.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-permission-common@0.7.10
  - @backstage/plugin-search-common@1.2.8

## 1.2.11

### Patch Changes

- b168d7e7ea: Fix highlighting for non-string fields on the `Lunr` search engine implementation.
- Updated dependencies
  - @backstage/backend-common@0.19.9
  - @backstage/backend-plugin-api@0.6.7
  - @backstage/backend-tasks@0.5.12
  - @backstage/plugin-permission-common@0.7.10
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-search-common@1.2.8

## 1.2.11-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.7-next.2
  - @backstage/backend-common@0.19.9-next.2
  - @backstage/backend-tasks@0.5.12-next.2

## 1.2.11-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.9-next.1
  - @backstage/backend-tasks@0.5.12-next.1
  - @backstage/backend-plugin-api@0.6.7-next.1
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-permission-common@0.7.9
  - @backstage/plugin-search-common@1.2.7

## 1.2.11-next.0

### Patch Changes

- b168d7e7ea: Fix highlighting for non-string fields on the `Lunr` search engine implementation.
- Updated dependencies
  - @backstage/backend-common@0.19.9-next.0
  - @backstage/backend-plugin-api@0.6.7-next.0
  - @backstage/backend-tasks@0.5.12-next.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-permission-common@0.7.9
  - @backstage/plugin-search-common@1.2.7

## 1.2.10

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.11
  - @backstage/backend-common@0.19.8
  - @backstage/errors@1.2.3
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/config@1.1.1
  - @backstage/plugin-permission-common@0.7.9
  - @backstage/plugin-search-common@1.2.7

## 1.2.10-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8-next.2
  - @backstage/errors@1.2.3-next.0
  - @backstage/backend-tasks@0.5.11-next.2
  - @backstage/backend-plugin-api@0.6.6-next.2
  - @backstage/config@1.1.1-next.0
  - @backstage/plugin-permission-common@0.7.9-next.0
  - @backstage/plugin-search-common@1.2.7-next.0

## 1.2.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.10-next.1
  - @backstage/backend-common@0.19.7-next.1
  - @backstage/backend-plugin-api@0.6.5-next.1
  - @backstage/config@1.1.0
  - @backstage/errors@1.2.2
  - @backstage/plugin-permission-common@0.7.8
  - @backstage/plugin-search-common@1.2.6

## 1.2.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.7-next.0
  - @backstage/config@1.1.0
  - @backstage/backend-plugin-api@0.6.5-next.0
  - @backstage/backend-tasks@0.5.10-next.0
  - @backstage/errors@1.2.2
  - @backstage/plugin-permission-common@0.7.8
  - @backstage/plugin-search-common@1.2.6

## 1.2.7

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.8
  - @backstage/backend-common@0.19.5
  - @backstage/config@1.1.0
  - @backstage/errors@1.2.2
  - @backstage/plugin-permission-common@0.7.8
  - @backstage/plugin-search-common@1.2.6
  - @backstage/backend-plugin-api@0.6.3

## 1.2.7-next.3

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.2
  - @backstage/errors@1.2.2-next.0
  - @backstage/plugin-permission-common@0.7.8-next.2
  - @backstage/plugin-search-common@1.2.6-next.2
  - @backstage/backend-plugin-api@0.6.3-next.3
  - @backstage/backend-common@0.19.5-next.3
  - @backstage/backend-tasks@0.5.8-next.3

## 1.2.7-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-tasks@0.5.8-next.2
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/plugin-permission-common@0.7.8-next.1
  - @backstage/errors@1.2.1
  - @backstage/plugin-search-common@1.2.6-next.1

## 1.2.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.0
  - @backstage/backend-tasks@0.5.8-next.1
  - @backstage/backend-common@0.19.5-next.1
  - @backstage/backend-plugin-api@0.6.3-next.1
  - @backstage/plugin-permission-common@0.7.8-next.0
  - @backstage/errors@1.2.1
  - @backstage/plugin-search-common@1.2.6-next.0

## 1.2.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.4-next.0
  - @backstage/backend-tasks@0.5.7-next.0
  - @backstage/backend-plugin-api@0.6.2-next.0
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/plugin-permission-common@0.7.7
  - @backstage/plugin-search-common@1.2.5

## 1.2.4

### Patch Changes

- 12a8c94eda8d: Add package repository and homepage metadata
- e3e9bc10298b: Fix Lunr search engine highlight by ignoring invalid metadata positions.
- Updated dependencies
  - @backstage/backend-common@0.19.2
  - @backstage/backend-plugin-api@0.6.0
  - @backstage/backend-tasks@0.5.5
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/plugin-permission-common@0.7.7
  - @backstage/plugin-search-common@1.2.5

## 1.2.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-tasks@0.5.5-next.2
  - @backstage/backend-common@0.19.2-next.2

## 1.2.4-next.1

### Patch Changes

- 12a8c94eda8d: Add package repository and homepage metadata
- Updated dependencies
  - @backstage/backend-common@0.19.2-next.1
  - @backstage/backend-plugin-api@0.6.0-next.1
  - @backstage/backend-tasks@0.5.5-next.1
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/plugin-permission-common@0.7.7
  - @backstage/plugin-search-common@1.2.5

## 1.2.4-next.0

### Patch Changes

- e3e9bc10298b: Fix Lunr search engine highlight by ignoring invalid metadata positions.
- Updated dependencies
  - @backstage/backend-common@0.19.2-next.0
  - @backstage/backend-plugin-api@0.5.5-next.0
  - @backstage/backend-tasks@0.5.5-next.0
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/plugin-permission-common@0.7.7
  - @backstage/plugin-search-common@1.2.5

## 1.2.3

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.1
  - @backstage/backend-common@0.19.1
  - @backstage/backend-plugin-api@0.5.4
  - @backstage/backend-tasks@0.5.4
  - @backstage/config@1.0.8
  - @backstage/plugin-permission-common@0.7.7
  - @backstage/plugin-search-common@1.2.5

## 1.2.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.1-next.0
  - @backstage/backend-common@0.19.1-next.0
  - @backstage/backend-plugin-api@0.5.4-next.0
  - @backstage/backend-tasks@0.5.4-next.0
  - @backstage/config@1.0.8
  - @backstage/plugin-permission-common@0.7.7-next.0
  - @backstage/plugin-search-common@1.2.5-next.0

## 1.2.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0
  - @backstage/errors@1.2.0
  - @backstage/backend-plugin-api@0.5.3
  - @backstage/backend-tasks@0.5.3
  - @backstage/config@1.0.8
  - @backstage/plugin-permission-common@0.7.6
  - @backstage/plugin-search-common@1.2.4

## 1.2.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0-next.2
  - @backstage/backend-plugin-api@0.5.3-next.2
  - @backstage/backend-tasks@0.5.3-next.2
  - @backstage/config@1.0.7
  - @backstage/errors@1.2.0-next.0
  - @backstage/plugin-permission-common@0.7.6-next.0
  - @backstage/plugin-search-common@1.2.4-next.0

## 1.2.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0-next.1
  - @backstage/errors@1.2.0-next.0
  - @backstage/backend-plugin-api@0.5.3-next.1
  - @backstage/backend-tasks@0.5.3-next.1
  - @backstage/plugin-permission-common@0.7.6-next.0
  - @backstage/config@1.0.7
  - @backstage/plugin-search-common@1.2.4-next.0

## 1.2.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.6-next.0
  - @backstage/config@1.0.7
  - @backstage/backend-plugin-api@0.5.3-next.0
  - @backstage/backend-tasks@0.5.3-next.0
  - @backstage/errors@1.1.5
  - @backstage/plugin-permission-common@0.7.5
  - @backstage/plugin-search-common@1.2.3

## 1.2.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5
  - @backstage/backend-tasks@0.5.2
  - @backstage/backend-plugin-api@0.5.2
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/plugin-permission-common@0.7.5
  - @backstage/plugin-search-common@1.2.3

## 1.2.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/backend-tasks@0.5.2-next.1
  - @backstage/backend-plugin-api@0.5.2-next.1
  - @backstage/config@1.0.7

## 1.2.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.0
  - @backstage/backend-tasks@0.5.2-next.0
  - @backstage/backend-plugin-api@0.5.2-next.0
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/plugin-permission-common@0.7.5
  - @backstage/plugin-search-common@1.2.3

## 1.2.0

### Minor Changes

- 1469daa409e: Exports services and extension points that can be used with the new backend system. For documentation on how to migrate, check out the [how to migrate to the new backend system guide](https://backstage.io/docs/features/search/how-to-guides/#how-to-migrate-your-backend-installation-to-use-search-together-with-the-new-backend-system).

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.4
  - @backstage/plugin-permission-common@0.7.5
  - @backstage/backend-tasks@0.5.1
  - @backstage/backend-plugin-api@0.5.1
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/plugin-search-common@1.2.3

## 1.2.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.4-next.2
  - @backstage/backend-plugin-api@0.5.1-next.2
  - @backstage/backend-tasks@0.5.1-next.2
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/plugin-permission-common@0.7.5-next.0
  - @backstage/plugin-search-common@1.2.3-next.0

## 1.2.0-next.1

### Minor Changes

- 1469daa409e: Exports services and extension points that can be used with the new backend system. For documentation on how to migrate, check out the [how to migrate to the new backend system guide](https://backstage.io/docs/features/search/how-to-guides/#how-to-migrate-your-backend-installation-to-use-search-together-with-the-new-backend-system).

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.7.5-next.0
  - @backstage/backend-tasks@0.5.1-next.1
  - @backstage/backend-common@0.18.4-next.1
  - @backstage/backend-plugin-api@0.5.1-next.1
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/plugin-search-common@1.2.3-next.0

## 1.1.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.4-next.0
  - @backstage/config@1.0.7
  - @backstage/backend-tasks@0.5.1-next.0
  - @backstage/errors@1.1.5
  - @backstage/plugin-permission-common@0.7.4
  - @backstage/plugin-search-common@1.2.2

## 1.1.4

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.0
  - @backstage/backend-common@0.18.3
  - @backstage/errors@1.1.5
  - @backstage/plugin-permission-common@0.7.4
  - @backstage/config@1.0.7
  - @backstage/plugin-search-common@1.2.2

## 1.1.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.0-next.2
  - @backstage/backend-common@0.18.3-next.2
  - @backstage/config@1.0.7-next.0

## 1.1.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.1.5-next.0
  - @backstage/backend-common@0.18.3-next.1
  - @backstage/plugin-permission-common@0.7.4-next.0
  - @backstage/backend-tasks@0.4.4-next.1
  - @backstage/config@1.0.7-next.0
  - @backstage/plugin-search-common@1.2.2-next.0

## 1.1.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.4.4-next.0
  - @backstage/backend-common@0.18.3-next.0
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/plugin-permission-common@0.7.3
  - @backstage/plugin-search-common@1.2.1

## 1.1.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.2
  - @backstage/backend-tasks@0.4.3
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/plugin-permission-common@0.7.3
  - @backstage/plugin-search-common@1.2.1

## 1.1.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.2-next.2
  - @backstage/backend-tasks@0.4.3-next.2
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/plugin-permission-common@0.7.3
  - @backstage/plugin-search-common@1.2.1

## 1.1.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.2-next.1
  - @backstage/backend-tasks@0.4.3-next.1
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/plugin-permission-common@0.7.3
  - @backstage/plugin-search-common@1.2.1

## 1.1.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.2-next.0
  - @backstage/backend-tasks@0.4.3-next.0

## 1.1.1

### Patch Changes

- 011bd518b7: Fixed spelling mistakes in documentation.
- Updated dependencies
  - @backstage/backend-common@0.18.0
  - @backstage/backend-tasks@0.4.1
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/plugin-permission-common@0.7.3
  - @backstage/plugin-search-common@1.2.1

## 1.1.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.0-next.1
  - @backstage/backend-tasks@0.4.1-next.1
  - @backstage/config@1.0.6-next.0
  - @backstage/errors@1.1.4
  - @backstage/plugin-permission-common@0.7.3-next.0
  - @backstage/plugin-search-common@1.2.1-next.0

## 1.1.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/backend-tasks@0.4.1-next.0
  - @backstage/errors@1.1.4
  - @backstage/plugin-permission-common@0.7.3-next.0
  - @backstage/plugin-search-common@1.2.1-next.0

## 1.1.1-next.0

### Patch Changes

- 011bd518b7: Fixed spelling mistakes in documentation.
- Updated dependencies
  - @backstage/backend-common@0.17.0
  - @backstage/backend-tasks@0.4.0
  - @backstage/config@1.0.5
  - @backstage/errors@1.1.4
  - @backstage/plugin-permission-common@0.7.2
  - @backstage/plugin-search-common@1.2.0

## 1.1.0

### Minor Changes

- 29ebc43a0b: numberOfResults is now provided alongside the query result
- dff9843718: The search engine now better handles the case when it receives 0 documents at index-time. Prior to this change, the indexer would replace any existing index with an empty index, effectively deleting it. Now instead, a warning is logged, and any existing index is left alone (preserving the index from the last successful indexing attempt).

### Patch Changes

- a962ce0551: Wait for indexer initialization before finalizing indexing.
- de8a975911: Changed to use native `AbortController` and `AbortSignal` from Node.js, instead
  of the one from `node-abort-controller`. This is possible now that the minimum
  supported Node.js version of the project is 16.

  Note that their interfaces are very slightly different, but typically not in a
  way that matters to consumers. If you see any typescript errors as a direct
  result from this, they are compatible with each other in the ways that we
  interact with them, and should be possible to type-cast across without ill
  effects.

- 683ced83f6: Fixed a bug that could cause a `max listeners exceeded warning` to be logged when more than 10 collators were running simultaneously.
- 81b1e7b0fe: Updated indexer and decorator base classes to take advantage of features introduced in Node.js v16; be sure you are running a [supported version of Node.js](https://backstage.io/docs/releases/v1.8.0#node-16-and-18).
- 54c5836f7a: Use of `TestPipeline.withSubject()` is now deprecated. Instead, use the `fromCollator`, `fromDecorator`, or `fromIndexer` static methods to instantiate a test pipeline. You may also use the class' `withCollator`, `withDecorator`, and `withIndexer` instance methods to build test pipelines that consist of multiple test subjects.
- Updated dependencies
  - @backstage/backend-common@0.17.0
  - @backstage/backend-tasks@0.4.0
  - @backstage/plugin-permission-common@0.7.2
  - @backstage/errors@1.1.4
  - @backstage/plugin-search-common@1.2.0
  - @backstage/config@1.0.5

## 1.1.0-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.4.0-next.3
  - @backstage/plugin-permission-common@0.7.2-next.2
  - @backstage/backend-common@0.17.0-next.3
  - @backstage/config@1.0.5-next.1
  - @backstage/errors@1.1.4-next.1
  - @backstage/plugin-search-common@1.2.0-next.3

## 1.1.0-next.2

### Minor Changes

- 29ebc43a0b: numberOfResults is now provided alongside the query result

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.17.0-next.2
  - @backstage/plugin-search-common@1.2.0-next.2
  - @backstage/backend-tasks@0.4.0-next.2
  - @backstage/config@1.0.5-next.1
  - @backstage/errors@1.1.4-next.1
  - @backstage/plugin-permission-common@0.7.2-next.1

## 1.0.5-next.1

### Patch Changes

- de8a975911: Changed to use native `AbortController` and `AbortSignal` from Node.js, instead
  of the one from `node-abort-controller`. This is possible now that the minimum
  supported Node.js version of the project is 16.

  Note that their interfaces are very slightly different, but typically not in a
  way that matters to consumers. If you see any typescript errors as a direct
  result from this, they are compatible with each other in the ways that we
  interact with them, and should be possible to type-cast across without ill
  effects.

- 54c5836f7a: Use of `TestPipeline.withSubject()` is now deprecated. Instead, use the `fromCollator`, `fromDecorator`, or `fromIndexer` static methods to instantiate a test pipeline. You may also use the class' `withCollator`, `withDecorator`, and `withIndexer` instance methods to build test pipelines that consist of multiple test subjects.
- Updated dependencies
  - @backstage/backend-common@0.17.0-next.1
  - @backstage/backend-tasks@0.4.0-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/errors@1.1.4-next.1
  - @backstage/plugin-permission-common@0.7.2-next.1
  - @backstage/plugin-search-common@1.1.2-next.1

## 1.0.5-next.0

### Patch Changes

- a962ce0551: Wait for indexer initialization before finalizing indexing.
- 683ced83f6: Fixed a bug that could cause a `max listeners exceeded warning` to be logged when more than 10 collators were running simultaneously.
- 81b1e7b0fe: Updated indexer and decorator base classes to take advantage of features introduced in Node.js v16; be sure you are running a [supported version of Node.js](https://backstage.io/docs/releases/v1.8.0#node-16-and-18).
- Updated dependencies
  - @backstage/backend-common@0.16.1-next.0
  - @backstage/plugin-permission-common@0.7.2-next.0
  - @backstage/backend-tasks@0.3.8-next.0
  - @backstage/config@1.0.5-next.0
  - @backstage/errors@1.1.4-next.0
  - @backstage/plugin-search-common@1.1.2-next.0

## 1.0.4

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.16.0
  - @backstage/backend-tasks@0.3.7
  - @backstage/plugin-permission-common@0.7.1
  - @backstage/config@1.0.4
  - @backstage/errors@1.1.3
  - @backstage/plugin-search-common@1.1.1

## 1.0.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.16.0-next.1
  - @backstage/backend-tasks@0.3.7-next.1
  - @backstage/config@1.0.4-next.0
  - @backstage/errors@1.1.3-next.0
  - @backstage/plugin-permission-common@0.7.1-next.0
  - @backstage/plugin-search-common@1.1.1-next.0

## 1.0.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.16.0-next.0
  - @backstage/backend-tasks@0.3.7-next.0
  - @backstage/plugin-permission-common@0.7.1-next.0
  - @backstage/config@1.0.4-next.0
  - @backstage/errors@1.1.3-next.0
  - @backstage/plugin-search-common@1.1.1-next.0

## 1.0.3

### Patch Changes

- a799972bb1: The search engine has been updated to take advantage of the `pageLimit` property on search queries. If none is provided, the search engine will continue to use its default value of 25 results per page.
- 8006f8a602: In order to improve the debuggability of the search indexing process, messages logged during indexing are now tagged with a `documentType` whose value corresponds to the `type` being indexed.
- Updated dependencies
  - @backstage/backend-common@0.15.2
  - @backstage/backend-tasks@0.3.6
  - @backstage/plugin-permission-common@0.7.0
  - @backstage/plugin-search-common@1.1.0
  - @backstage/config@1.0.3
  - @backstage/errors@1.1.2

## 1.0.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.3.6-next.2
  - @backstage/backend-common@0.15.2-next.2
  - @backstage/plugin-permission-common@0.7.0-next.2
  - @backstage/plugin-search-common@1.1.0-next.2
  - @backstage/config@1.0.3-next.2
  - @backstage/errors@1.1.2-next.2

## 1.0.3-next.1

### Patch Changes

- a799972bb1: The search engine has been updated to take advantage of the `pageLimit` property on search queries. If none is provided, the search engine will continue to use its default value of 25 results per page.
- Updated dependencies
  - @backstage/backend-common@0.15.2-next.1
  - @backstage/plugin-search-common@1.1.0-next.1
  - @backstage/backend-tasks@0.3.6-next.1
  - @backstage/config@1.0.3-next.1
  - @backstage/errors@1.1.2-next.1
  - @backstage/plugin-permission-common@0.6.5-next.1

## 1.0.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.2-next.0
  - @backstage/backend-tasks@0.3.6-next.0
  - @backstage/config@1.0.3-next.0
  - @backstage/errors@1.1.2-next.0
  - @backstage/plugin-permission-common@0.6.5-next.0
  - @backstage/plugin-search-common@1.0.2-next.0

## 1.0.2

### Patch Changes

- 3f739be9d9: Minor API signatures cleanup
- a1124adf5e: Fixed bug in LunrSearchEngine where stopwords in title is causing in-doc search not working
- Updated dependencies
  - @backstage/backend-common@0.15.1
  - @backstage/backend-tasks@0.3.5
  - @backstage/config@1.0.2
  - @backstage/errors@1.1.1
  - @backstage/plugin-permission-common@0.6.4
  - @backstage/plugin-search-common@1.0.1

## 1.0.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.2-next.0
  - @backstage/errors@1.1.1-next.0
  - @backstage/plugin-permission-common@0.6.4-next.2
  - @backstage/backend-common@0.15.1-next.3
  - @backstage/backend-tasks@0.3.5-next.1

## 1.0.2-next.1

### Patch Changes

- a1124adf5e: Fixed bug in LunrSearchEngine where stopwords in title is causing in-doc search not working
- Updated dependencies
  - @backstage/backend-common@0.15.1-next.1

## 1.0.2-next.0

### Patch Changes

- 3f739be9d9: Minor API signatures cleanup
- Updated dependencies
  - @backstage/backend-common@0.15.1-next.0
  - @backstage/backend-tasks@0.3.5-next.0
  - @backstage/plugin-permission-common@0.6.4-next.0
  - @backstage/plugin-search-common@1.0.1-next.0

## 1.0.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.0
  - @backstage/backend-tasks@0.3.4

## 1.0.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.0-next.0
  - @backstage/backend-tasks@0.3.4-next.0

## 1.0.0

### Major Changes

- 7bd7d336b2: This package has been promoted to 1.0. Read more about what it means in [New release: Backstage Search 1.0 blog](https://backstage.io/blog/2022/07/19/releasing-backstage-search-1.0)

### Patch Changes

- a21cd43467: Exports `MissingIndexError` that can be used by the search engines for better error handling when missing index.
- Updated dependencies
  - @backstage/backend-common@0.14.1
  - @backstage/plugin-search-common@1.0.0
  - @backstage/plugin-permission-common@0.6.3
  - @backstage/backend-tasks@0.3.3
  - @backstage/errors@1.1.0

## 0.6.3-next.2

### Patch Changes

- a21cd43467: Exports `MissingIndexError` that can be used by the search engines for better error handling when missing index.
- Updated dependencies
  - @backstage/backend-common@0.14.1-next.3
  - @backstage/plugin-permission-common@0.6.3-next.1
  - @backstage/backend-tasks@0.3.3-next.3

## 0.6.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.14.1-next.1
  - @backstage/errors@1.1.0-next.0
  - @backstage/backend-tasks@0.3.3-next.1
  - @backstage/plugin-permission-common@0.6.3-next.0
  - @backstage/plugin-search-common@0.3.6-next.0

## 0.6.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.14.1-next.0
  - @backstage/backend-tasks@0.3.3-next.0

## 0.6.2

### Patch Changes

- e7794a0aaa: propagate indexing errors so they don't appear successful to the task scheduler
- 3bb25a9acc: Introducing a `NewlineDelimitedJsonCollatorFactory`, which can be used to create search indices from newline delimited JSON files stored in external storage readable via a configured `UrlReader` instance.

  This is useful if you have an independent process periodically generating `*.ndjson` files consisting of `IndexableDocument` objects and want to be able to generate a fresh index based on the latest version of such a file.

- 3bb25a9acc: Fixed a bug that prevented `TestPipeline.withSubject` from identifying valid `Readable` subjects that were technically transform streams.
- 915700f64f: The provided search engine now adds a pagination-aware `rank` value to all results.
- 7d8acfc32e: Replaced all `@beta` exports with `@public` exports
- Updated dependencies
  - @backstage/plugin-search-common@0.3.5
  - @backstage/backend-tasks@0.3.2
  - @backstage/backend-common@0.14.0
  - @backstage/plugin-permission-common@0.6.2

## 0.6.2-next.2

### Patch Changes

- 7d8acfc32e: Replaced all `@beta` exports with `@public` exports
- Updated dependencies
  - @backstage/plugin-search-common@0.3.5-next.1
  - @backstage/backend-common@0.14.0-next.2
  - @backstage/backend-tasks@0.3.2-next.2

## 0.6.2-next.1

### Patch Changes

- 3bb25a9acc: Introducing a `NewlineDelimitedJsonCollatorFactory`, which can be used to create search indices from newline delimited JSON files stored in external storage readable via a configured `UrlReader` instance.

  This is useful if you have an independent process periodically generating `*.ndjson` files consisting of `IndexableDocument` objects and want to be able to generate a fresh index based on the latest version of such a file.

- 3bb25a9acc: Fixed a bug that prevented `TestPipeline.withSubject` from identifying valid `Readable` subjects that were technically transform streams.
- Updated dependencies
  - @backstage/backend-tasks@0.3.2-next.1
  - @backstage/backend-common@0.13.6-next.1
  - @backstage/plugin-permission-common@0.6.2-next.0
  - @backstage/plugin-search-common@0.3.5-next.0

## 0.6.2-next.0

### Patch Changes

- e7794a0aaa: propagate indexing errors so they don't appear successful to the task scheduler
- Updated dependencies
  - @backstage/backend-tasks@0.3.2-next.0

## 0.6.1

### Patch Changes

- 71d3432710: Search Engines will now index documents in batches of 1000 instead of 100 (under the hood). This may result in your Backstage backend consuming slightly more memory during index runs, but should dramatically improve indexing performance for large document sets.
- 3a74e203a8: Support generating highlighted matched terms in search result data
- Updated dependencies
  - @backstage/backend-tasks@0.3.1
  - @backstage/plugin-search-common@0.3.4

## 0.6.1-next.1

### Patch Changes

- 71d3432710: Search Engines will now index documents in batches of 1000 instead of 100 (under the hood). This may result in your Backstage backend consuming slightly more memory during index runs, but should dramatically improve indexing performance for large document sets.
- 3a74e203a8: Support generating highlighted matched terms in search result data
- Updated dependencies
  - @backstage/backend-tasks@0.3.1-next.1
  - @backstage/plugin-search-common@0.3.4-next.0

## 0.6.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.3.1-next.0

## 0.6.0

### Minor Changes

- 0a63e99a26: **BREAKING**: `IndexBuilder.addCollator()` now requires a `schedule` parameter (replacing `defaultRefreshIntervalSeconds`) which is expected to be a `TaskRunner` that is configured with the desired search indexing schedule for the given collator.

  `Scheduler.addToSchedule()` now takes a new parameter object (`ScheduleTaskParameters`) with two new options `id` and `scheduledRunner` in addition to the migrated `task` argument.

  NOTE: The search backend plugin now creates a dedicated database for coordinating indexing tasks.

  To make this change to an existing app, make the following changes to `packages/backend/src/plugins/search.ts`:

  ```diff
  +import { Duration } from 'luxon';

  /* ... */

  +  const schedule = env.scheduler.createScheduledTaskRunner({
  +    frequency: Duration.fromObject({ minutes: 10 }),
  +    timeout: Duration.fromObject({ minutes: 15 }),
  +    initialDelay: Duration.fromObject({ seconds: 3 }),
  +  });

     indexBuilder.addCollator({
  -    defaultRefreshIntervalSeconds: 600,
  +    schedule,
       factory: DefaultCatalogCollatorFactory.fromConfig(env.config, {
        discovery: env.discovery,
        tokenManager: env.tokenManager,
       }),
     });

     indexBuilder.addCollator({
  -    defaultRefreshIntervalSeconds: 600,
  +    schedule,
       factory: DefaultTechDocsCollatorFactory.fromConfig(env.config, {
        discovery: env.discovery,
        tokenManager: env.tokenManager,
       }),
     });

     const { scheduler } = await indexBuilder.build();
  -  setTimeout(() => scheduler.start(), 3000);
  +  scheduler.start();
  /* ... */
  ```

  NOTE: For scenarios where the `lunr` search engine is used in a multi-node configuration, a non-distributed `TaskRunner` like the following should be implemented to ensure consistency across nodes (alternatively, you can configure
  the search plugin to use a non-distributed DB such as [SQLite](https://backstage.io/docs/tutorials/configuring-plugin-databases#postgresql-and-sqlite-3)):

  ```diff
  +import { TaskInvocationDefinition, TaskRunner } from '@backstage/backend-tasks';

  /* ... */

  +  const schedule: TaskRunner = {
  +    run: async (task: TaskInvocationDefinition) => {
  +      const startRefresh = async () => {
  +        while (!task.signal?.aborted) {
  +          try {
  +            await task.fn(task.signal);
  +          } catch {
  +            // ignore intentionally
  +          }
  +
  +          await new Promise(resolve => setTimeout(resolve, 600 * 1000));
  +        }
  +      };
  +      startRefresh();
  +    },
  +  };

     indexBuilder.addCollator({
  -    defaultRefreshIntervalSeconds: 600,
  +    schedule,
       factory: DefaultCatalogCollatorFactory.fromConfig(env.config, {
        discovery: env.discovery,
        tokenManager: env.tokenManager,
       }),
     });

  /* ... */
  ```

### Patch Changes

- 62ee65422c: Use new `IndexableResultSet` type as return type of query method in `SearchEngine` implementation.
- 230ad0826f: Bump to using `@types/node` v16
- Updated dependencies
  - @backstage/backend-tasks@0.3.0
  - @backstage/plugin-search-common@0.3.3

## 0.6.0-next.1

### Minor Changes

- 0a63e99a26: **BREAKING**: `IndexBuilder.addCollator()` now requires a `schedule` parameter (replacing `defaultRefreshIntervalSeconds`) which is expected to be a `TaskRunner` that is configured with the desired search indexing schedule for the given collator.

  `Scheduler.addToSchedule()` now takes a new parameter object (`ScheduleTaskParameters`) with two new options `id` and `scheduledRunner` in addition to the migrated `task` argument.

  NOTE: The search backend plugin now creates a dedicated database for coordinating indexing tasks.

  To make this change to an existing app, make the following changes to `packages/backend/src/plugins/search.ts`:

  ```diff
  +import { Duration } from 'luxon';

  /* ... */

  +  const schedule = env.scheduler.createScheduledTaskRunner({
  +    frequency: Duration.fromObject({ minutes: 10 }),
  +    timeout: Duration.fromObject({ minutes: 15 }),
  +    initialDelay: Duration.fromObject({ seconds: 3 }),
  +  });

     indexBuilder.addCollator({
  -    defaultRefreshIntervalSeconds: 600,
  +    schedule,
       factory: DefaultCatalogCollatorFactory.fromConfig(env.config, {
        discovery: env.discovery,
        tokenManager: env.tokenManager,
       }),
     });

     indexBuilder.addCollator({
  -    defaultRefreshIntervalSeconds: 600,
  +    schedule,
       factory: DefaultTechDocsCollatorFactory.fromConfig(env.config, {
        discovery: env.discovery,
        tokenManager: env.tokenManager,
       }),
     });

     const { scheduler } = await indexBuilder.build();
  -  setTimeout(() => scheduler.start(), 3000);
  +  scheduler.start();
  /* ... */
  ```

  NOTE: For scenarios where the `lunr` search engine is used in a multi-node configuration, a non-distributed `TaskRunner` like the following should be implemented to ensure consistency across nodes (alternatively, you can configure
  the search plugin to use a non-distributed DB such as [SQLite](https://backstage.io/docs/tutorials/configuring-plugin-databases#postgresql-and-sqlite-3)):

  ```diff
  +import { TaskInvocationDefinition, TaskRunner } from '@backstage/backend-tasks';

  /* ... */

  +  const schedule: TaskRunner = {
  +    run: async (task: TaskInvocationDefinition) => {
  +      const startRefresh = async () => {
  +        while (!task.signal?.aborted) {
  +          try {
  +            await task.fn(task.signal);
  +          } catch {
  +            // ignore intentionally
  +          }
  +
  +          await new Promise(resolve => setTimeout(resolve, 600 * 1000));
  +        }
  +      };
  +      startRefresh();
  +    },
  +  };

     indexBuilder.addCollator({
  -    defaultRefreshIntervalSeconds: 600,
  +    schedule,
       factory: DefaultCatalogCollatorFactory.fromConfig(env.config, {
        discovery: env.discovery,
        tokenManager: env.tokenManager,
       }),
     });

  /* ... */
  ```

### Patch Changes

- 230ad0826f: Bump to using `@types/node` v16

## 0.5.3-next.0

### Patch Changes

- 62ee65422c: Use new `IndexableResultSet` type as return type of query method in `SearchEngine` implementation.
- Updated dependencies
  - @backstage/plugin-search-common@0.3.3-next.0

## 0.5.2

### Patch Changes

- f24ef7864e: Minor typo fixes
- Updated dependencies
  - @backstage/errors@1.0.0
  - @backstage/plugin-search-common@0.3.2

## 0.5.1

### Patch Changes

- 3e54f6c436: Use `@backstage/plugin-search-common` package instead of `@backstage/search-common`.
- Updated dependencies
  - @backstage/plugin-search-common@0.3.1

## 0.5.1-next.0

### Patch Changes

- 3e54f6c436: Use `@backstage/plugin-search-common` package instead of `@backstage/search-common`.
- Updated dependencies
  - @backstage/plugin-search-common@0.3.1-next.0

## 0.5.0

### Minor Changes

- 022507c860: **BREAKING**

  The Backstage Search Platform's indexing process has been rewritten as a stream
  pipeline in order to improve efficiency and performance on large document sets.

  The concepts of `Collator` and `Decorator` have been replaced with readable and
  transform object streams (respectively), as well as factory classes to
  instantiate them. Accordingly, the `SearchEngine.index()` method has also been
  replaced with a `getIndexer()` factory method that resolves to a writable
  object stream.

  Check [this upgrade guide](https://backstage.io/docs/features/search/how-to-guides#how-to-migrate-from-search-alpha-to-beta)
  for further details.

### Patch Changes

- Updated dependencies
  - @backstage/search-common@0.3.0

## 0.4.7

### Patch Changes

- Fix for the previous release with missing type declarations.
- Updated dependencies
  - @backstage/search-common@0.2.4

## 0.4.6

### Patch Changes

- c77c5c7eb6: Added `backstage.role` to `package.json`
- Updated dependencies
  - @backstage/search-common@0.2.3

## 0.4.5

### Patch Changes

- f6389e9e5d: Track visibility permissions by document type in IndexBuilder
- Updated dependencies
  - @backstage/search-common@0.2.2

## 0.4.4

### Patch Changes

- 5333451def: Cleaned up API exports

## 0.4.3

### Patch Changes

- a369f19e7e: Handle special case when filter array has single value optimizing Lunr search behaviour.
- Updated dependencies
  - @backstage/search-common@0.2.1

## 0.4.2

### Patch Changes

- a13f21cdc: Implement optional `pageCursor` based paging in search.

  To use paging in your app, add a `<SearchResultPager />` to your
  `SearchPage.tsx`.

- Updated dependencies
  - @backstage/search-common@0.2.0

## 0.4.1

### Patch Changes

- d9c13d535: Implements configuration and indexing functionality for ElasticSearch search engine. Adds indexing, searching and default translator for ElasticSearch and modifies default backend example-app to use ES if it is configured.

  ## Example configurations:

  ### AWS

  Using AWS hosted ElasticSearch the only configuration options needed is the URL to the ElasticSearch service. The implementation assumes
  that environment variables for AWS access key id and secret access key are defined in accordance to the [default AWS credential chain.](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-credentials-node.html).

  ```yaml
  search:
    elasticsearch:
      provider: aws
      node: https://my-backstage-search-asdfqwerty.eu-west-1.es.amazonaws.com
  ```

  ### Elastic.co

  Elastic Cloud hosted ElasticSearch uses a Cloud ID to determine the instance of hosted ElasticSearch to connect to. Additionally, username and password needs to be provided either directly or using environment variables like defined in [Backstage documentation.](https://backstage.io/docs/conf/writing#includes-and-dynamic-data)

  ```yaml
  search:
    elasticsearch:
      provider: elastic
      cloudId: backstage-elastic:asdfqwertyasdfqwertyasdfqwertyasdfqwerty==
      auth:
        username: elastic
        password: changeme
  ```

  ### Others

  Other ElasticSearch instances can be connected to by using standard ElasticSearch authentication methods and exposed URL, provided that the cluster supports that. The configuration options needed are the URL to the node and authentication information. Authentication can be handled by either providing username/password or and API key or a bearer token. In case both username/password combination and one of the tokens are provided, token takes precedence. For more information how to create an API key, see [Elastic documentation on API keys](https://www.elastic.co/guide/en/elasticsearch/reference/current/security-api-create-api-key.html) and how to create a bearer token, see [Elastic documentation on tokens.](https://www.elastic.co/guide/en/elasticsearch/reference/current/security-api-create-service-token.html)

  #### Configuration examples

  ##### With username and password

  ```yaml
  search:
    elasticsearch:
      node: http://localhost:9200
      auth:
        username: elastic
        password: changeme
  ```

  ##### With bearer token

  ```yaml
  search:
    elasticsearch:
      node: http://localhost:9200
      auth:
        bearer: token
  ```

  ##### With API key

  ```yaml
  search:
    elasticsearch:
      node: http://localhost:9200
      auth:
        apiKey: base64EncodedKey
  ```

- Updated dependencies
  - @backstage/search-common@0.1.3

## 0.4.0

### Minor Changes

- 97b2eb37b: Change return value of `SearchEngine.index` to `Promise<void>` to support
  implementation of external search engines.

## 0.3.0

### Minor Changes

- 9f3ecb555: Build search queries using the query builder in `LunrSearchEngine`. This removes
  the support for specifying custom queries with the lunr query syntax, but makes
  sure that inputs are properly escaped. Supporting the full lunr syntax is still
  possible by setting a custom query translator.
  The interface of `LunrSearchEngine.setTranslator()` is changed to support
  building lunr queries.

### Patch Changes

- 9f3ecb555: Enhance the search results of `LunrSearchEngine` to support a more natural
  search experience. This is done by allowing typos (by using fuzzy search) and
  supporting typeahead search (using wildcard queries to match incomplete words).
- 4176a60e5: Change search scheduler from starting indexing in a fixed interval (for example
  every 60 seconds), to wait a fixed time between index runs.
  This makes sure that no second index process for the same document type is
  started when the previous one is still running.

## 0.2.2

### Patch Changes

- 9c8ea7e24: Handle errors in collators and decorators and log them.
- 7e7cec86a: Fixed bug preventing searches with filter values containing `:` from returning results.

## 0.2.1

### Patch Changes

- 14aad6113: Improved the quality of free text searches in LunrSearchEngine.

## 0.2.0

### Minor Changes

- 5aff84759: This release represents a move out of a pre-alpha phase of the Backstage Search
  plugin, into an alpha phase. With this release, you gain more control over the
  layout of your search page on the frontend, as well as the ability to extend
  search on the backend to encompass everything Backstage users may want to find.

  If you are updating to version `v0.4.0` of `@backstage/plugin-search` from a
  prior release, you will need to make modifications to your app backend.

  First, navigate to your backend package and install the two related search
  backend packages:

  ```sh
  cd packages/backend
  yarn add @backstage/plugin-search-backend @backstage/plugin-search-backend-node
  ```

  Wire up these new packages into your app backend by first creating a new
  `search.ts` file at `src/plugins/search.ts` with contents like the following:

  ```typescript
  import { useHotCleanup } from '@backstage/backend-common';
  import { createRouter } from '@backstage/plugin-search-backend';
  import {
    IndexBuilder,
    LunrSearchEngine,
  } from '@backstage/plugin-search-backend-node';
  import { PluginEnvironment } from '../types';
  import { DefaultCatalogCollator } from '@backstage/plugin-catalog-backend';

  export default async function createPlugin({
    logger,
    discovery,
  }: PluginEnvironment) {
    // Initialize a connection to a search engine.
    const searchEngine = new LunrSearchEngine({ logger });
    const indexBuilder = new IndexBuilder({ logger, searchEngine });

    // Collators are responsible for gathering documents known to plugins. This
    // particular collator gathers entities from the software catalog.
    indexBuilder.addCollator({
      defaultRefreshIntervalSeconds: 600,
      collator: new DefaultCatalogCollator({ discovery }),
    });

    // The scheduler controls when documents are gathered from collators and sent
    // to the search engine for indexing.
    const { scheduler } = await indexBuilder.build();

    // A 3 second delay gives the backend server a chance to initialize before
    // any collators are executed, which may attempt requests against the API.
    setTimeout(() => scheduler.start(), 3000);
    useHotCleanup(module, () => scheduler.stop());

    return await createRouter({
      engine: indexBuilder.getSearchEngine(),
      logger,
    });
  }
  ```

  Then, ensure the search plugin you configured above is initialized by modifying
  your backend's `index.ts` file in the following ways:

  ```diff
  +import search from './plugins/search';
  // ...
  +const searchEnv = useHotMemoize(module, () => createEnv('search'));
  // ...
  +apiRouter.use('/search', await search(searchEnv));
  // ...
  ```

### Patch Changes

- db1c8f93b: The `<Search...Next /> set of components exported by the Search Plugin are now updated to use the Search Backend API. These will be made available as the default non-"next" versions in a follow-up release.

  The interfaces for decorators and collators in the Search Backend have also seen minor, breaking revisions ahead of a general release. If you happen to be building on top of these interfaces, check and update your implementations accordingly. The APIs will be considered more stable in a follow-up release.

- Updated dependencies [db1c8f93b]
  - @backstage/search-common@0.1.2

## 0.1.4

### Patch Changes

- e1e757569: Introduced Scheduler which is responsible for adding new tasks to a schedule together with it's interval timer as well as starting and stopping the scheduler processes.

## 0.1.3

### Patch Changes

- b9b2b4b76: Lunr Search Engine support

## 0.1.2

### Patch Changes

- 4d248725e: Bump to use the in-repo latest `backend-common`, and the correct version of `express-promise-router`
