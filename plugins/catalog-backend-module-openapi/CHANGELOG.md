# @backstage/plugin-catalog-backend-module-openapi

## 0.1.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.2.0-next.2
  - @backstage/plugin-catalog-backend@1.5.0-next.2
  - @backstage/backend-common@0.15.2-next.2
  - @backstage/catalog-model@1.1.2-next.2
  - @backstage/config@1.0.3-next.2
  - @backstage/integration@1.3.2-next.2
  - @backstage/types@1.0.0

## 0.1.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.2-next.1
  - @backstage/catalog-model@1.1.2-next.1
  - @backstage/config@1.0.3-next.1
  - @backstage/integration@1.3.2-next.1
  - @backstage/types@1.0.0
  - @backstage/plugin-catalog-backend@1.4.1-next.1
  - @backstage/plugin-catalog-node@1.1.1-next.1

## 0.1.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.2-next.0
  - @backstage/plugin-catalog-backend@1.4.1-next.0
  - @backstage/plugin-catalog-node@1.1.1-next.0
  - @backstage/backend-common@0.15.2-next.0
  - @backstage/config@1.0.3-next.0
  - @backstage/integration@1.3.2-next.0
  - @backstage/types@1.0.0

## 0.1.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.1
  - @backstage/plugin-catalog-node@1.1.0
  - @backstage/integration@1.3.1
  - @backstage/plugin-catalog-backend@1.4.0
  - @backstage/catalog-model@1.1.1
  - @backstage/config@1.0.2

## 0.1.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.1.0-next.2
  - @backstage/catalog-model@1.1.1-next.0
  - @backstage/config@1.0.2-next.0
  - @backstage/integration@1.3.1-next.2
  - @backstage/plugin-catalog-backend@1.4.0-next.3
  - @backstage/backend-common@0.15.1-next.3

## 0.1.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.1-next.1
  - @backstage/plugin-catalog-backend@1.4.0-next.1

## 0.1.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.1-next.0
  - @backstage/plugin-catalog-backend@1.3.2-next.0
  - @backstage/integration@1.3.1-next.0
  - @backstage/plugin-catalog-node@1.0.2-next.0

## 0.1.1

### Patch Changes

- b50e8e533b: Add an `$openapi` placeholder resolver that supports more use cases for resolving `$ref` instances. This means that the quite recently added `OpenApiRefProcessor` has been deprecated in favor of the `openApiPlaceholderResolver`.

  An example of how to use it can be seen below.

  ```yaml
  apiVersion: backstage.io/v1alpha1
  kind: API
  metadata:
    name: example
    description: Example API
  spec:
    type: openapi
    lifecycle: production
    owner: team
    definition:
      $openapi: ./spec/openapi.yaml # by using $openapi Backstage will now resolve all $ref instances
  ```

- Updated dependencies
  - @backstage/backend-common@0.15.0
  - @backstage/plugin-catalog-node@1.0.1
  - @backstage/integration@1.3.0
  - @backstage/plugin-catalog-backend@1.3.1

## 0.1.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.0-next.0
  - @backstage/integration@1.3.0-next.0
  - @backstage/plugin-catalog-backend@1.3.1-next.0

## 0.1.0

### Minor Changes

- 67503d159e: Add basic OpenAPI \$ref support.

  For more information see [here](https://github.com/backstage/backstage/tree/master/plugins/catalog-backend-module-openapi).

### Patch Changes

- 4881dc4c84: Updated dependency `openapi-types` to `^12.0.0`.
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.3.0
  - @backstage/backend-common@0.14.1
  - @backstage/catalog-model@1.1.0
  - @backstage/integration@1.2.2

## 0.1.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.3.0-next.3
  - @backstage/backend-common@0.14.1-next.3
  - @backstage/integration@1.2.2-next.3
  - @backstage/catalog-model@1.1.0-next.3

## 0.1.0-next.1

### Patch Changes

- 4881dc4c84: Updated dependency `openapi-types` to `^12.0.0`.
- Updated dependencies
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/backend-common@0.14.1-next.2
  - @backstage/plugin-catalog-backend@1.2.1-next.2
  - @backstage/integration@1.2.2-next.2

## 0.1.0-next.0

### Minor Changes

- 67503d159e: Add basic OpenAPI \$ref support.

  For more information see [here](https://github.com/backstage/backstage/tree/master/plugins/catalog-backend-module-openapi).

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.0-next.1
  - @backstage/backend-common@0.14.1-next.1
  - @backstage/plugin-catalog-backend@1.2.1-next.1
  - @backstage/integration@1.2.2-next.1
