# @backstage/plugin-auth-backend-module-aws-alb-provider

## 0.1.13-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.21-next.0
  - @backstage/backend-common@0.23.2-next.0
  - @backstage/plugin-auth-backend@0.22.8-next.0
  - @backstage/plugin-auth-node@0.4.16-next.0
  - @backstage/errors@1.2.4

## 0.1.11

### Patch Changes

- 78a0b08: Internal refactor to handle `BackendFeature` contract change.
- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/backend-common@0.23.0
  - @backstage/backend-plugin-api@0.6.19
  - @backstage/plugin-auth-node@0.4.14
  - @backstage/plugin-auth-backend@0.22.6
  - @backstage/errors@1.2.4

## 0.1.11-next.3

### Patch Changes

- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.3
  - @backstage/plugin-auth-node@0.4.14-next.3
  - @backstage/plugin-auth-backend@0.22.6-next.3
  - @backstage/backend-common@0.23.0-next.3
  - @backstage/errors@1.2.4

## 0.1.11-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.2
  - @backstage/backend-common@0.23.0-next.2
  - @backstage/plugin-auth-backend@0.22.6-next.2
  - @backstage/plugin-auth-node@0.4.14-next.2
  - @backstage/errors@1.2.4

## 0.1.11-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.1
  - @backstage/backend-common@0.23.0-next.1
  - @backstage/plugin-auth-backend@0.22.6-next.1
  - @backstage/plugin-auth-node@0.4.14-next.1

## 0.1.11-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.22.1-next.0
  - @backstage/plugin-auth-backend@0.22.6-next.0
  - @backstage/backend-plugin-api@0.6.19-next.0
  - @backstage/plugin-auth-node@0.4.14-next.0
  - @backstage/errors@1.2.4

## 0.1.10

### Patch Changes

- 4a0577e: fix: Move config declarations to appropriate auth backend modules
- Updated dependencies
  - @backstage/backend-common@0.22.0
  - @backstage/backend-plugin-api@0.6.18
  - @backstage/plugin-auth-backend@0.22.5
  - @backstage/plugin-auth-node@0.4.13

## 0.1.10-next.2

### Patch Changes

- 4a0577e: fix: Move config declarations to appropriate auth backend modules
- Updated dependencies
  - @backstage/backend-common@0.22.0-next.2
  - @backstage/plugin-auth-backend@0.22.5-next.2

## 0.1.10-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.22.0-next.1
  - @backstage/plugin-auth-backend@0.22.5-next.1
  - @backstage/plugin-auth-node@0.4.13-next.1
  - @backstage/backend-plugin-api@0.6.18-next.1

## 0.1.10-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-backend@0.22.5-next.0
  - @backstage/plugin-auth-node@0.4.13-next.0
  - @backstage/backend-common@0.21.8-next.0
  - @backstage/backend-plugin-api@0.6.18-next.0
  - @backstage/errors@1.2.4

## 0.1.9

### Patch Changes

- f286d59: Added support for AWS GovCloud (US) regions
- 30f5a51: Added `authModuleAwsAlbProvider` as a default export.

  It can now be used like this in your backend: `backend.add(import('@backstage/plugin-auth-backend-module-aws-alb-provider'));`

- Updated dependencies
  - @backstage/backend-common@0.21.7
  - @backstage/plugin-auth-backend@0.22.4
  - @backstage/backend-plugin-api@0.6.17
  - @backstage/plugin-auth-node@0.4.12
  - @backstage/errors@1.2.4

## 0.1.9-next.1

### Patch Changes

- 30f5a51: Added `authModuleAwsAlbProvider` as a default export.

  It can now be used like this in your backend: `backend.add(import('@backstage/plugin-auth-backend-module-aws-alb-provider'));`

- Updated dependencies
  - @backstage/backend-common@0.21.7-next.1
  - @backstage/plugin-auth-backend@0.22.4-next.1
  - @backstage/backend-plugin-api@0.6.17-next.1
  - @backstage/plugin-auth-node@0.4.12-next.1
  - @backstage/errors@1.2.4

## 0.1.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.7-next.0
  - @backstage/backend-plugin-api@0.6.17-next.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-auth-backend@0.22.4-next.0
  - @backstage/plugin-auth-node@0.4.12-next.0

## 0.1.8

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-backend@0.22.3
  - @backstage/plugin-auth-node@0.4.11
  - @backstage/backend-common@0.21.6
  - @backstage/backend-plugin-api@0.6.16
  - @backstage/errors@1.2.4

## 0.1.7

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.5
  - @backstage/plugin-auth-backend@0.22.2
  - @backstage/plugin-auth-node@0.4.10
  - @backstage/backend-plugin-api@0.6.15
  - @backstage/errors@1.2.4

## 0.1.6

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-backend@0.22.1

## 0.1.5

### Patch Changes

- 2af5354: Bump dependency `jose` to v5
- b1b012d: Fix issue with `providerInfo` not being set properly for some proxy providers, by making `providerInfo` an explicit optional return from `authenticate`
- Updated dependencies
  - @backstage/backend-common@0.21.4
  - @backstage/plugin-auth-node@0.4.9
  - @backstage/errors@1.2.4
  - @backstage/backend-plugin-api@0.6.14
  - @backstage/plugin-auth-backend@0.22.0

## 0.1.5-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.4-next.2
  - @backstage/plugin-auth-backend@0.22.0-next.2
  - @backstage/plugin-auth-node@0.4.9-next.2
  - @backstage/backend-plugin-api@0.6.14-next.2
  - @backstage/errors@1.2.4-next.0

## 0.1.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/plugin-auth-backend@0.22.0-next.1
  - @backstage/plugin-auth-node@0.4.9-next.1
  - @backstage/errors@1.2.4-next.0

## 0.1.4-next.0

### Patch Changes

- 2af5354: Bump dependency `jose` to v5
- b1b012d: Fix issue with `providerInfo` not being set properly for some proxy providers, by making `providerInfo` an explicit optional return from `authenticate`
- Updated dependencies
  - @backstage/backend-common@0.21.3-next.0
  - @backstage/plugin-auth-node@0.4.8-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/backend-plugin-api@0.6.13-next.0
  - @backstage/plugin-auth-backend@0.22.0-next.0

## 0.1.0

### Minor Changes

- 23a98f8: Migrated the AWS ALB auth provider to new `@backstage/plugin-auth-backend-module-aws-alb-provider` module package.

### Patch Changes

- d309cad: Refactored to use the `jose` library for JWT handling.
- Updated dependencies
  - @backstage/backend-common@0.21.0
  - @backstage/plugin-auth-backend@0.21.0
  - @backstage/plugin-auth-node@0.4.4
  - @backstage/backend-plugin-api@0.6.10
  - @backstage/errors@1.2.3

## 0.1.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.3
  - @backstage/plugin-auth-backend@0.21.0-next.3
  - @backstage/plugin-auth-node@0.4.4-next.3
  - @backstage/backend-plugin-api@0.6.10-next.3
  - @backstage/errors@1.2.3

## 0.1.0-next.1

### Patch Changes

- d309cad: Refactored to use the `jose` library for JWT handling.
- Updated dependencies
  - @backstage/plugin-auth-backend@0.21.0-next.2
  - @backstage/backend-common@0.21.0-next.2
  - @backstage/backend-plugin-api@0.6.10-next.2
  - @backstage/plugin-auth-node@0.4.4-next.2
  - @backstage/errors@1.2.3

## 0.1.0-next.0

### Minor Changes

- 23a98f8: Migrated the AWS ALB auth provider to new `@backstage/plugin-auth-backend-module-aws-alb-provider` module package.

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.10-next.1
  - @backstage/backend-common@0.21.0-next.1
  - @backstage/plugin-auth-backend@0.20.4-next.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-auth-node@0.4.4-next.1
