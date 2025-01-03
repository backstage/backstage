# @backstage/plugin-catalog-backend-module-logs

## 0.1.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.1.1-next.1
  - @backstage/plugin-catalog-backend@1.30.0-next.1
  - @backstage/plugin-events-node@0.4.7-next.1

## 0.1.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.30.0-next.0
  - @backstage/backend-plugin-api@1.1.1-next.0
  - @backstage/plugin-events-node@0.4.7-next.0

## 0.1.5

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.29.0
  - @backstage/backend-plugin-api@1.1.0
  - @backstage/plugin-events-node@0.4.6

## 0.1.5-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.29.0-next.2
  - @backstage/backend-plugin-api@1.1.0-next.2
  - @backstage/plugin-events-node@0.4.6-next.2

## 0.1.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.29.0-next.1
  - @backstage/backend-plugin-api@1.1.0-next.1
  - @backstage/plugin-events-node@0.4.6-next.1

## 0.1.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.3-next.0
  - @backstage/plugin-catalog-backend@1.28.1-next.0
  - @backstage/plugin-events-node@0.4.6-next.0

## 0.1.4

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.4.5
  - @backstage/plugin-catalog-backend@1.28.0
  - @backstage/backend-plugin-api@1.0.2

## 0.1.4-next.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.4.5-next.3
  - @backstage/plugin-catalog-backend@1.28.0-next.3
  - @backstage/backend-plugin-api@1.0.2-next.2

## 0.1.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.28.0-next.2
  - @backstage/plugin-events-node@0.4.5-next.2
  - @backstage/backend-plugin-api@1.0.2-next.2

## 0.1.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.2-next.1
  - @backstage/plugin-catalog-backend@1.27.2-next.1
  - @backstage/plugin-events-node@0.4.4-next.1

## 0.1.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.4.3-next.0
  - @backstage/backend-plugin-api@1.0.2-next.0
  - @backstage/plugin-catalog-backend@1.27.2-next.0

## 0.1.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.27.0
  - @backstage/plugin-events-node@0.4.1
  - @backstage/backend-plugin-api@1.0.1

## 0.1.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.26.2-next.2
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/plugin-events-node@0.4.1-next.1

## 0.1.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.26.2-next.1
  - @backstage/backend-plugin-api@1.0.1-next.0
  - @backstage/plugin-events-node@0.4.1-next.0

## 0.1.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.26.1-next.0
  - @backstage/plugin-events-node@0.4.1-next.0
  - @backstage/backend-plugin-api@1.0.1-next.0

## 0.1.0

### Minor Changes

- d425fc4: **BREAKING**: The return values from `createBackendPlugin`, `createBackendModule`, and `createServiceFactory` are now simply `BackendFeature` and `ServiceFactory`, instead of the previously deprecated form of a function that returns them. For this reason, `createServiceFactory` also no longer accepts the callback form where you provide direct options to the service. This also affects all `coreServices.*` service refs.

  This may in particular affect tests; if you were effectively doing `createBackendModule({...})()` (note the parentheses), you can now remove those extra parentheses at the end. You may encounter cases of this in your `packages/backend/src/index.ts` too, where you add plugins, modules, and services. If you were using `createServiceFactory` with a function as its argument for the purpose of passing in options, this pattern has been deprecated for a while and is no longer supported. You may want to explore the new multiton patterns to achieve your goals, or moving settings to app-config.

  As part of this change, the `IdentityFactoryOptions` type was removed, and can no longer be used to tweak that service. The identity service was also deprecated some time ago, and you will want to [migrate to the new auth system](https://backstage.io/docs/tutorials/auth-service-migration) if you still rely on it.

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.0
  - @backstage/plugin-catalog-backend@1.26.0
  - @backstage/plugin-events-node@0.4.0

## 0.1.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.0-next.2
  - @backstage/plugin-catalog-backend@1.26.0-next.2
  - @backstage/plugin-events-node@0.4.0-next.2

## 0.1.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.25.3-next.1
  - @backstage/backend-plugin-api@0.9.0-next.1
  - @backstage/plugin-events-node@0.4.0-next.1

## 0.1.0-next.0

### Minor Changes

- d425fc4: **BREAKING**: The return values from `createBackendPlugin`, `createBackendModule`, and `createServiceFactory` are now simply `BackendFeature` and `ServiceFactory`, instead of the previously deprecated form of a function that returns them. For this reason, `createServiceFactory` also no longer accepts the callback form where you provide direct options to the service. This also affects all `coreServices.*` service refs.

  This may in particular affect tests; if you were effectively doing `createBackendModule({...})()` (note the parentheses), you can now remove those extra parentheses at the end. You may encounter cases of this in your `packages/backend/src/index.ts` too, where you add plugins, modules, and services. If you were using `createServiceFactory` with a function as its argument for the purpose of passing in options, this pattern has been deprecated for a while and is no longer supported. You may want to explore the new multiton patterns to achieve your goals, or moving settings to app-config.

  As part of this change, the `IdentityFactoryOptions` type was removed, and can no longer be used to tweak that service. The identity service was also deprecated some time ago, and you will want to [migrate to the new auth system](https://backstage.io/docs/tutorials/auth-service-migration) if you still rely on it.

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.9.0-next.0
  - @backstage/plugin-catalog-backend@1.25.3-next.0
  - @backstage/plugin-events-node@0.4.0-next.0

## 0.0.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0
  - @backstage/plugin-catalog-backend@1.25.0
  - @backstage/plugin-events-node@0.3.9

## 0.0.2-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.3
  - @backstage/plugin-catalog-backend@1.24.1-next.3
  - @backstage/plugin-events-node@0.3.9-next.3

## 0.0.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.2
  - @backstage/plugin-catalog-backend@1.24.1-next.2
  - @backstage/plugin-events-node@0.3.9-next.2

## 0.0.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.24.1-next.1
  - @backstage/backend-plugin-api@0.7.1-next.1
  - @backstage/plugin-events-node@0.3.9-next.1

## 0.0.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.24.1-next.0
  - @backstage/backend-plugin-api@0.7.1-next.0
  - @backstage/plugin-events-node@0.3.9-next.0

## 0.0.1

### Patch Changes

- 97caf55: Creates a new module to make logging catalog errors simple. This module subscribes to catalog events and logs them.

  See [Backstage documentation](https://backstage.io/docs/features/software-catalog/configuration#subscribing-to-catalog-errors) for details on how to install
  and configure the plugin.

- Updated dependencies
  - @backstage/backend-plugin-api@0.7.0
  - @backstage/plugin-events-node@0.3.8
  - @backstage/plugin-catalog-backend@1.24.0

## 0.0.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.24.0-next.1
  - @backstage/backend-plugin-api@0.6.22-next.1
  - @backstage/plugin-events-node@0.3.8-next.1

## 0.0.1-next.0

### Patch Changes

- 97caf55: Creates a new module to make logging catalog errors simple. This module subscribes to catalog events and logs them.

  See [Backstage documentation](https://backstage.io/docs/features/software-catalog/configuration#subscribing-to-catalog-errors) for details on how to install
  and configure the plugin.

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.21-next.0
  - @backstage/plugin-catalog-backend@1.23.2-next.0
  - @backstage/plugin-events-node@0.3.7-next.0
