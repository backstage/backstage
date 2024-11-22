# @backstage/plugin-auth-backend-module-azure-easyauth-provider

## 0.2.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.4
  - @backstage/backend-plugin-api@1.0.2
  - @backstage/catalog-model@1.7.1
  - @backstage/errors@1.2.5

## 0.2.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.4-next.2
  - @backstage/backend-plugin-api@1.0.2-next.2
  - @backstage/catalog-model@1.7.0
  - @backstage/errors@1.2.4

## 0.2.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.2-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-auth-node@0.5.4-next.1

## 0.2.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.4-next.0
  - @backstage/backend-plugin-api@1.0.2-next.0
  - @backstage/catalog-model@1.7.0
  - @backstage/errors@1.2.4

## 0.2.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.3
  - @backstage/backend-plugin-api@1.0.1
  - @backstage/catalog-model@1.7.0
  - @backstage/errors@1.2.4

## 0.2.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.3-next.1
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/errors@1.2.4

## 0.2.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.3-next.0
  - @backstage/backend-plugin-api@1.0.1-next.0
  - @backstage/catalog-model@1.7.0
  - @backstage/errors@1.2.4

## 0.2.0

### Minor Changes

- d425fc4: **BREAKING**: The return values from `createBackendPlugin`, `createBackendModule`, and `createServiceFactory` are now simply `BackendFeature` and `ServiceFactory`, instead of the previously deprecated form of a function that returns them. For this reason, `createServiceFactory` also no longer accepts the callback form where you provide direct options to the service. This also affects all `coreServices.*` service refs.

  This may in particular affect tests; if you were effectively doing `createBackendModule({...})()` (note the parentheses), you can now remove those extra parentheses at the end. You may encounter cases of this in your `packages/backend/src/index.ts` too, where you add plugins, modules, and services. If you were using `createServiceFactory` with a function as its argument for the purpose of passing in options, this pattern has been deprecated for a while and is no longer supported. You may want to explore the new multiton patterns to achieve your goals, or moving settings to app-config.

  As part of this change, the `IdentityFactoryOptions` type was removed, and can no longer be used to tweak that service. The identity service was also deprecated some time ago, and you will want to [migrate to the new auth system](https://backstage.io/docs/tutorials/auth-service-migration) if you still rely on it.

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.0
  - @backstage/plugin-auth-node@0.5.2
  - @backstage/catalog-model@1.7.0
  - @backstage/errors@1.2.4

## 0.2.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.2-next.2
  - @backstage/backend-plugin-api@1.0.0-next.2
  - @backstage/catalog-model@1.6.0
  - @backstage/errors@1.2.4

## 0.2.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.2-next.1
  - @backstage/backend-plugin-api@0.9.0-next.1
  - @backstage/catalog-model@1.6.0
  - @backstage/errors@1.2.4

## 0.2.0-next.0

### Minor Changes

- d425fc4: **BREAKING**: The return values from `createBackendPlugin`, `createBackendModule`, and `createServiceFactory` are now simply `BackendFeature` and `ServiceFactory`, instead of the previously deprecated form of a function that returns them. For this reason, `createServiceFactory` also no longer accepts the callback form where you provide direct options to the service. This also affects all `coreServices.*` service refs.

  This may in particular affect tests; if you were effectively doing `createBackendModule({...})()` (note the parentheses), you can now remove those extra parentheses at the end. You may encounter cases of this in your `packages/backend/src/index.ts` too, where you add plugins, modules, and services. If you were using `createServiceFactory` with a function as its argument for the purpose of passing in options, this pattern has been deprecated for a while and is no longer supported. You may want to explore the new multiton patterns to achieve your goals, or moving settings to app-config.

  As part of this change, the `IdentityFactoryOptions` type was removed, and can no longer be used to tweak that service. The identity service was also deprecated some time ago, and you will want to [migrate to the new auth system](https://backstage.io/docs/tutorials/auth-service-migration) if you still rely on it.

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.9.0-next.0
  - @backstage/plugin-auth-node@0.5.2-next.0
  - @backstage/catalog-model@1.6.0
  - @backstage/errors@1.2.4

## 0.1.6

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0
  - @backstage/plugin-auth-node@0.5.0
  - @backstage/catalog-model@1.6.0
  - @backstage/errors@1.2.4

## 0.1.6-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.3
  - @backstage/catalog-model@1.6.0-next.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-auth-node@0.5.0-next.3

## 0.1.6-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.2
  - @backstage/plugin-auth-node@0.5.0-next.2
  - @backstage/catalog-model@1.5.0
  - @backstage/errors@1.2.4

## 0.1.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.7.1-next.1
  - @backstage/catalog-model@1.5.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-auth-node@0.4.18-next.1

## 0.1.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.7.1-next.0
  - @backstage/catalog-model@1.5.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-auth-node@0.4.18-next.0

## 0.1.5

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.7.0
  - @backstage/plugin-auth-node@0.4.17
  - @backstage/catalog-model@1.5.0
  - @backstage/errors@1.2.4

## 0.1.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.22-next.1
  - @backstage/catalog-model@1.5.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-auth-node@0.4.17-next.1

## 0.1.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.21-next.0
  - @backstage/plugin-auth-node@0.4.16-next.0
  - @backstage/catalog-model@1.5.0
  - @backstage/errors@1.2.4

## 0.1.2

### Patch Changes

- 78a0b08: Internal refactor to handle `BackendFeature` contract change.
- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19
  - @backstage/plugin-auth-node@0.4.14
  - @backstage/catalog-model@1.5.0
  - @backstage/errors@1.2.4

## 0.1.2-next.2

### Patch Changes

- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.3
  - @backstage/plugin-auth-node@0.4.14-next.3
  - @backstage/catalog-model@1.5.0
  - @backstage/errors@1.2.4

## 0.1.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.2
  - @backstage/plugin-auth-node@0.4.14-next.2
  - @backstage/catalog-model@1.5.0
  - @backstage/errors@1.2.4

## 0.1.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.0
  - @backstage/plugin-auth-node@0.4.14-next.0
  - @backstage/catalog-model@1.5.0
  - @backstage/errors@1.2.4

## 0.1.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.5.0
  - @backstage/backend-plugin-api@0.6.18
  - @backstage/plugin-auth-node@0.4.13

## 0.1.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.4.13-next.1
  - @backstage/backend-plugin-api@0.6.18-next.1

## 0.1.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.5.0-next.0
  - @backstage/plugin-auth-node@0.4.13-next.0
  - @backstage/backend-plugin-api@0.6.18-next.0
  - @backstage/errors@1.2.4

## 0.1.0

### Minor Changes

- 06a6725: New auth backend module to add `azure-easyauth` provider. Note that as part of this change the default provider ID has been changed from `easyAuth` to `azureEasyAuth`, which means that if you switch to this new module you need to update your app config as well as the `provider` prop of the `ProxiedSignInPage` in the frontend.

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.17
  - @backstage/plugin-auth-node@0.4.12
  - @backstage/catalog-model@1.4.5
  - @backstage/errors@1.2.4
