# @backstage/plugin-auth-backend-module-oauth2-proxy-provider

## 0.2.6

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.1
  - @backstage/backend-plugin-api@1.2.1
  - @backstage/errors@1.2.7

## 0.2.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.1-next.1
  - @backstage/backend-plugin-api@1.2.1-next.1
  - @backstage/errors@1.2.7

## 0.2.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.1-next.0
  - @backstage/backend-plugin-api@1.2.1-next.0

## 0.2.5

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.2.0
  - @backstage/plugin-auth-node@0.6.0
  - @backstage/errors@1.2.7

## 0.2.5-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.2.0-next.2
  - @backstage/plugin-auth-node@0.6.0-next.2
  - @backstage/errors@1.2.7

## 0.2.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.2.0-next.1
  - @backstage/plugin-auth-node@0.6.0-next.1
  - @backstage/errors@1.2.7

## 0.2.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.2.0-next.0
  - @backstage/errors@1.2.7
  - @backstage/plugin-auth-node@0.5.7-next.0

## 0.2.4

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.6
  - @backstage/backend-plugin-api@1.1.1
  - @backstage/errors@1.2.7

## 0.2.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.1.1-next.1
  - @backstage/errors@1.2.7-next.0
  - @backstage/plugin-auth-node@0.5.6-next.1

## 0.2.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.6-next.0
  - @backstage/backend-plugin-api@1.1.1-next.0
  - @backstage/errors@1.2.6

## 0.2.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.5
  - @backstage/backend-plugin-api@1.1.0
  - @backstage/errors@1.2.6

## 0.2.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.1.0-next.2
  - @backstage/errors@1.2.6-next.0
  - @backstage/plugin-auth-node@0.5.5-next.2

## 0.2.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.5-next.1
  - @backstage/backend-plugin-api@1.1.0-next.1
  - @backstage/errors@1.2.5

## 0.2.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.3-next.0
  - @backstage/plugin-auth-node@0.5.5-next.0
  - @backstage/errors@1.2.5

## 0.2.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.4
  - @backstage/backend-plugin-api@1.0.2
  - @backstage/errors@1.2.5

## 0.2.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.4-next.2
  - @backstage/backend-plugin-api@1.0.2-next.2
  - @backstage/errors@1.2.4

## 0.2.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.2-next.1
  - @backstage/errors@1.2.4
  - @backstage/plugin-auth-node@0.5.4-next.1

## 0.2.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.4-next.0
  - @backstage/backend-plugin-api@1.0.2-next.0
  - @backstage/errors@1.2.4

## 0.2.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.3
  - @backstage/backend-plugin-api@1.0.1
  - @backstage/errors@1.2.4

## 0.2.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.3-next.1
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/errors@1.2.4

## 0.2.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.3-next.0
  - @backstage/backend-plugin-api@1.0.1-next.0
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
  - @backstage/errors@1.2.4

## 0.2.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.2-next.2
  - @backstage/backend-plugin-api@1.0.0-next.2
  - @backstage/errors@1.2.4

## 0.2.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.2-next.1
  - @backstage/backend-plugin-api@0.9.0-next.1
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
  - @backstage/errors@1.2.4

## 0.1.16

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0
  - @backstage/plugin-auth-node@0.5.0
  - @backstage/errors@1.2.4

## 0.1.16-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.3
  - @backstage/errors@1.2.4
  - @backstage/plugin-auth-node@0.5.0-next.3

## 0.1.16-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.2
  - @backstage/plugin-auth-node@0.5.0-next.2
  - @backstage/errors@1.2.4

## 0.1.16-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.7.1-next.1
  - @backstage/errors@1.2.4
  - @backstage/plugin-auth-node@0.4.18-next.1

## 0.1.16-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.7.1-next.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-auth-node@0.4.18-next.0

## 0.1.15

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.7.0
  - @backstage/plugin-auth-node@0.4.17
  - @backstage/errors@1.2.4

## 0.1.15-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.22-next.1
  - @backstage/errors@1.2.4
  - @backstage/plugin-auth-node@0.4.17-next.1

## 0.1.14-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.21-next.0
  - @backstage/plugin-auth-node@0.4.16-next.0
  - @backstage/errors@1.2.4

## 0.1.12

### Patch Changes

- 78a0b08: Internal refactor to handle `BackendFeature` contract change.
- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19
  - @backstage/plugin-auth-node@0.4.14
  - @backstage/errors@1.2.4

## 0.1.12-next.2

### Patch Changes

- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.3
  - @backstage/plugin-auth-node@0.4.14-next.3
  - @backstage/errors@1.2.4

## 0.1.12-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.2
  - @backstage/plugin-auth-node@0.4.14-next.2
  - @backstage/errors@1.2.4

## 0.1.12-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.0
  - @backstage/plugin-auth-node@0.4.14-next.0
  - @backstage/errors@1.2.4

## 0.1.11

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.18
  - @backstage/plugin-auth-node@0.4.13

## 0.1.11-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.4.13-next.1
  - @backstage/backend-plugin-api@0.6.18-next.1

## 0.1.11-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.4.13-next.0
  - @backstage/backend-plugin-api@0.6.18-next.0
  - @backstage/errors@1.2.4

## 0.1.10

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.17
  - @backstage/plugin-auth-node@0.4.12
  - @backstage/errors@1.2.4

## 0.1.10-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.17-next.1
  - @backstage/plugin-auth-node@0.4.12-next.1
  - @backstage/errors@1.2.4

## 0.1.10-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.17-next.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-auth-node@0.4.12-next.0

## 0.1.9

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.4.11
  - @backstage/backend-plugin-api@0.6.16
  - @backstage/errors@1.2.4

## 0.1.8

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.4.10
  - @backstage/backend-plugin-api@0.6.15
  - @backstage/errors@1.2.4

## 0.1.7

### Patch Changes

- 2af5354: Bump dependency `jose` to v5
- e77d7a9: Internal refactor to avoid deprecated method.
- b1b012d: Fix issue with `providerInfo` not being set properly for some proxy providers, by making `providerInfo` an explicit optional return from `authenticate`
- Updated dependencies
  - @backstage/plugin-auth-node@0.4.9
  - @backstage/errors@1.2.4
  - @backstage/backend-plugin-api@0.6.14

## 0.1.7-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.4.9-next.2
  - @backstage/backend-plugin-api@0.6.14-next.2
  - @backstage/errors@1.2.4-next.0

## 0.1.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/plugin-auth-node@0.4.9-next.1
  - @backstage/errors@1.2.4-next.0

## 0.1.6-next.0

### Patch Changes

- 2af5354: Bump dependency `jose` to v5
- e77d7a9: Internal refactor to avoid deprecated method.
- b1b012d: Fix issue with `providerInfo` not being set properly for some proxy providers, by making `providerInfo` an explicit optional return from `authenticate`
- Updated dependencies
  - @backstage/plugin-auth-node@0.4.8-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/backend-plugin-api@0.6.13-next.0

## 0.1.2

### Patch Changes

- 8472188: Added or fixed the `repository` field in `package.json`.
- Updated dependencies
  - @backstage/plugin-auth-node@0.4.4
  - @backstage/backend-plugin-api@0.6.10
  - @backstage/errors@1.2.3

## 0.1.2-next.3

### Patch Changes

- 8472188: Added or fixed the `repository` field in `package.json`.
- Updated dependencies
  - @backstage/plugin-auth-node@0.4.4-next.3
  - @backstage/backend-plugin-api@0.6.10-next.3
  - @backstage/errors@1.2.3

## 0.1.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.10-next.2
  - @backstage/plugin-auth-node@0.4.4-next.2
  - @backstage/errors@1.2.3

## 0.1.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.10-next.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-auth-node@0.4.4-next.1

## 0.1.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.4.4-next.0
  - @backstage/backend-plugin-api@0.6.10-next.0
  - @backstage/errors@1.2.3

## 0.1.1

### Patch Changes

- 4016f21: Remove some unused dependencies
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.9
  - @backstage/plugin-auth-node@0.4.3
  - @backstage/errors@1.2.3

## 0.1.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.9-next.2
  - @backstage/plugin-auth-node@0.4.3-next.2

## 0.1.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.4.3-next.1
  - @backstage/backend-plugin-api@0.6.9-next.1
  - @backstage/errors@1.2.3

## 0.1.1-next.0

### Patch Changes

- 4016f21: Remove some unused dependencies
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.9-next.0
  - @backstage/errors@1.2.3
  - @backstage/plugin-auth-node@0.4.3-next.0

## 0.1.0

### Minor Changes

- 271aa12: Release of `oauth2-proxy-provider` plugin

### Patch Changes

- a6be465: Exported the provider as default so it gets discovered when using `featureDiscoveryServiceFactory()`
- 510dab4: Change provider id from `oauth2ProxyProvider` to `oauth2Proxy`
- cc4228e: Switched module ID to use kebab-case.
- Updated dependencies
  - @backstage/backend-common@0.20.0
  - @backstage/plugin-auth-node@0.4.2
  - @backstage/backend-plugin-api@0.6.8
  - @backstage/errors@1.2.3

## 0.1.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.3
  - @backstage/backend-plugin-api@0.6.8-next.3
  - @backstage/errors@1.2.3
  - @backstage/plugin-auth-node@0.4.2-next.3

## 0.1.0-next.1

### Patch Changes

- a6be465: Exported the provider as default so it gets discovered when using `featureDiscoveryServiceFactory()`
- 510dab4: Change provider id from `oauth2ProxyProvider` to `oauth2Proxy`
- cc4228e: Switched module ID to use kebab-case.
- Updated dependencies
  - @backstage/backend-common@0.20.0-next.2
  - @backstage/plugin-auth-node@0.4.2-next.2
  - @backstage/backend-plugin-api@0.6.8-next.2
  - @backstage/errors@1.2.3

## 0.1.0-next.0

### Minor Changes

- 271aa12c7c: Release of `oauth2-proxy-provider` plugin

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-auth-node@0.4.2-next.1
