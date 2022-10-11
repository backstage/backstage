# @backstage/plugin-bitbucket-cloud-common

## 0.2.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.3.2-next.2

## 0.2.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.3.2-next.1

## 0.2.0-next.0

### Minor Changes

- ad74723fbf: Update Bitbucket Cloud models to latest OAS version.

  The latest specification contained some BREAKING CHANGES
  due to removed fields.

  All of these fields are not used at other plugins, though.
  Therefore, this change has no impact on other modules here.

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.3.2-next.0

## 0.1.3

### Patch Changes

- 667d917488: Updated dependency `msw` to `^0.47.0`.
- 87ec2ba4d6: Updated dependency `msw` to `^0.46.0`.
- bf5e9030eb: Updated dependency `msw` to `^0.45.0`.
- Updated dependencies
  - @backstage/integration@1.3.1

## 0.1.3-next.1

### Patch Changes

- 667d917488: Updated dependency `msw` to `^0.47.0`.
- 87ec2ba4d6: Updated dependency `msw` to `^0.46.0`.
- Updated dependencies
  - @backstage/integration@1.3.1-next.1

## 0.1.3-next.0

### Patch Changes

- bf5e9030eb: Updated dependency `msw` to `^0.45.0`.
- Updated dependencies
  - @backstage/integration@1.3.1-next.0

## 0.1.2

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.3.0

## 0.1.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.3.0-next.0

## 0.1.1

### Patch Changes

- a70869e775: Updated dependency `msw` to `^0.43.0`.
- 8006d0f9bf: Updated dependency `msw` to `^0.44.0`.
- Updated dependencies
  - @backstage/integration@1.2.2

## 0.1.1-next.1

### Patch Changes

- a70869e775: Updated dependency `msw` to `^0.43.0`.
- Updated dependencies
  - @backstage/integration@1.2.2-next.3

## 0.1.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.2.2-next.0

## 0.1.0

### Minor Changes

- 1dffa7dd4d: Add new common library `bitbucket-cloud-common` with a client for Bitbucket Cloud.

  This client can be reused across all packages and might be the future place for additional
  features like managing the rate limits, etc.

  The client itself was generated in parts using the `@openapitools/openapi-generator-cli`.

### Patch Changes

- 9122060776: Updated dependency `msw` to `^0.42.0`.
- Updated dependencies
  - @backstage/integration@1.2.1

## 0.1.0-next.0

### Minor Changes

- 1dffa7dd4d: Add new common library `bitbucket-cloud-common` with a client for Bitbucket Cloud.

  This client can be reused across all packages and might be the future place for additional
  features like managing the rate limits, etc.

  The client itself was generated in parts using the `@openapitools/openapi-generator-cli`.

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.2.1-next.1
