# @backstage/plugin-auth-backend-module-guest-provider

## 0.2.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.2.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/errors@1.2.7
  - @backstage/plugin-auth-node@0.5.7-next.0

## 0.2.4

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.6
  - @backstage/backend-plugin-api@1.1.1
  - @backstage/catalog-model@1.7.3
  - @backstage/errors@1.2.7

## 0.2.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.1.1-next.1
  - @backstage/catalog-model@1.7.3-next.0
  - @backstage/errors@1.2.7-next.0
  - @backstage/plugin-auth-node@0.5.6-next.1

## 0.2.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.6-next.0
  - @backstage/backend-plugin-api@1.1.1-next.0
  - @backstage/catalog-model@1.7.2
  - @backstage/errors@1.2.6

## 0.2.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.5
  - @backstage/backend-plugin-api@1.1.0
  - @backstage/errors@1.2.6
  - @backstage/catalog-model@1.7.2

## 0.2.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.1.0-next.2
  - @backstage/errors@1.2.6-next.0
  - @backstage/plugin-auth-node@0.5.5-next.2
  - @backstage/catalog-model@1.7.2-next.0

## 0.2.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.5-next.1
  - @backstage/backend-plugin-api@1.1.0-next.1
  - @backstage/catalog-model@1.7.1
  - @backstage/errors@1.2.5

## 0.2.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.3-next.0
  - @backstage/plugin-auth-node@0.5.5-next.0
  - @backstage/catalog-model@1.7.1
  - @backstage/errors@1.2.5

## 0.2.2

### Patch Changes

- 5d74716: Remove unused backend-common dependency
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

- 094eaa3: Remove references to in-repo backend-common
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

- 094eaa3: Remove references to in-repo backend-common
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

- 339c67d: This provider will now reject authentication attempts rather than halt backend startup when `dangerouslyAllowOutsideDevelopment` is not set in production.
- Updated dependencies
  - @backstage/backend-common@0.25.0
  - @backstage/backend-plugin-api@1.0.0
  - @backstage/plugin-auth-node@0.5.2
  - @backstage/catalog-model@1.7.0
  - @backstage/errors@1.2.4

## 0.2.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.25.0-next.2
  - @backstage/plugin-auth-node@0.5.2-next.2
  - @backstage/backend-plugin-api@1.0.0-next.2
  - @backstage/catalog-model@1.6.0
  - @backstage/errors@1.2.4

## 0.2.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.25.0-next.1
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
  - @backstage/backend-common@0.25.0-next.0
  - @backstage/plugin-auth-node@0.5.2-next.0
  - @backstage/catalog-model@1.6.0
  - @backstage/errors@1.2.4

## 0.1.9

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0
  - @backstage/backend-common@0.24.0
  - @backstage/plugin-auth-node@0.5.0
  - @backstage/catalog-model@1.6.0
  - @backstage/errors@1.2.4

## 0.1.9-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.3
  - @backstage/backend-common@0.23.4-next.3
  - @backstage/catalog-model@1.6.0-next.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-auth-node@0.5.0-next.3

## 0.1.9-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.2
  - @backstage/backend-common@0.23.4-next.2
  - @backstage/plugin-auth-node@0.5.0-next.2
  - @backstage/catalog-model@1.5.0
  - @backstage/errors@1.2.4

## 0.1.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.7.1-next.1
  - @backstage/backend-common@0.23.4-next.1
  - @backstage/catalog-model@1.5.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-auth-node@0.4.18-next.1

## 0.1.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.23.4-next.0
  - @backstage/backend-plugin-api@0.7.1-next.0
  - @backstage/catalog-model@1.5.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-auth-node@0.4.18-next.0

## 0.1.8

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.7.0
  - @backstage/backend-common@0.23.3
  - @backstage/plugin-auth-node@0.4.17
  - @backstage/catalog-model@1.5.0
  - @backstage/errors@1.2.4

## 0.1.8-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.23.3-next.1
  - @backstage/backend-plugin-api@0.6.22-next.1
  - @backstage/catalog-model@1.5.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-auth-node@0.4.17-next.1

## 0.1.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.21-next.0
  - @backstage/backend-common@0.23.2-next.0
  - @backstage/plugin-auth-node@0.4.16-next.0
  - @backstage/catalog-model@1.5.0
  - @backstage/errors@1.2.4

## 0.1.5

### Patch Changes

- 78a0b08: Internal refactor to handle `BackendFeature` contract change.
- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/backend-common@0.23.0
  - @backstage/backend-plugin-api@0.6.19
  - @backstage/plugin-auth-node@0.4.14
  - @backstage/catalog-model@1.5.0
  - @backstage/errors@1.2.4

## 0.1.5-next.3

### Patch Changes

- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.3
  - @backstage/plugin-auth-node@0.4.14-next.3
  - @backstage/backend-common@0.23.0-next.3
  - @backstage/catalog-model@1.5.0
  - @backstage/errors@1.2.4

## 0.1.5-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.2
  - @backstage/backend-common@0.23.0-next.2
  - @backstage/plugin-auth-node@0.4.14-next.2
  - @backstage/catalog-model@1.5.0
  - @backstage/errors@1.2.4

## 0.1.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.1
  - @backstage/backend-common@0.23.0-next.1
  - @backstage/plugin-auth-node@0.4.14-next.1

## 0.1.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.22.1-next.0
  - @backstage/backend-plugin-api@0.6.19-next.0
  - @backstage/plugin-auth-node@0.4.14-next.0
  - @backstage/catalog-model@1.5.0
  - @backstage/errors@1.2.4

## 0.1.4

### Patch Changes

- 07d8cca: Error if used outside of a development environment without explicit allowance
- Updated dependencies
  - @backstage/catalog-model@1.5.0
  - @backstage/backend-common@0.22.0
  - @backstage/backend-plugin-api@0.6.18
  - @backstage/plugin-auth-node@0.4.13

## 0.1.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.22.0-next.1
  - @backstage/plugin-auth-node@0.4.13-next.1
  - @backstage/backend-plugin-api@0.6.18-next.1

## 0.1.4-next.0

### Patch Changes

- 07d8cca: Error if used outside of a development environment without explicit allowance
- Updated dependencies
  - @backstage/catalog-model@1.5.0-next.0
  - @backstage/plugin-auth-node@0.4.13-next.0
  - @backstage/backend-common@0.21.8-next.0
  - @backstage/backend-plugin-api@0.6.18-next.0
  - @backstage/errors@1.2.4

## 0.1.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.7
  - @backstage/backend-plugin-api@0.6.17
  - @backstage/plugin-auth-node@0.4.12
  - @backstage/catalog-model@1.4.5
  - @backstage/errors@1.2.4

## 0.1.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.7-next.1
  - @backstage/backend-plugin-api@0.6.17-next.1
  - @backstage/plugin-auth-node@0.4.12-next.1
  - @backstage/catalog-model@1.4.5
  - @backstage/errors@1.2.4

## 0.1.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.7-next.0
  - @backstage/backend-plugin-api@0.6.17-next.0
  - @backstage/catalog-model@1.4.5
  - @backstage/errors@1.2.4
  - @backstage/plugin-auth-node@0.4.12-next.0

## 0.1.2

### Patch Changes

- 4cc8279: Add installation instructions
- Updated dependencies
  - @backstage/plugin-auth-node@0.4.11
  - @backstage/backend-common@0.21.6
  - @backstage/backend-plugin-api@0.6.16
  - @backstage/catalog-model@1.4.5
  - @backstage/errors@1.2.4

## 0.1.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.5
  - @backstage/plugin-auth-node@0.4.10
  - @backstage/backend-plugin-api@0.6.15
  - @backstage/catalog-model@1.4.5
  - @backstage/errors@1.2.4

## 0.1.0

### Minor Changes

- 1bedb23: Adds a new guest provider that maps guest users to actual tokens. This also shifts the default guest login to `user:development/guest` to reduce overlap with your production/real data. To change that (or set it back to the old default, use the new `auth.providers.guest.userEntityRef` config key) like so,

  ```yaml title=app-config.yaml
  auth:
    providers:
      guest:
        userEntityRef: user:default/guest
  ```

  This also adds a new property to control the ownership entity refs,

  ```yaml title=app-config.yaml
  auth:
    providers:
      guest:
        ownershipEntityRefs:
          - guests
          - development/custom
  ```

### Patch Changes

- 72dd380: Ensure that the config schema is present
- 50a331b: Fix issue for issuing a token when `guest` user does not exist in catalog
- Updated dependencies
  - @backstage/backend-common@0.21.4
  - @backstage/plugin-auth-node@0.4.9
  - @backstage/errors@1.2.4
  - @backstage/backend-plugin-api@0.6.14
  - @backstage/catalog-model@1.4.5

## 0.1.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.4-next.2
  - @backstage/plugin-auth-node@0.4.9-next.2
  - @backstage/backend-plugin-api@0.6.14-next.2
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0

## 0.1.0-next.1

### Patch Changes

- 72dd380: Ensure that the config schema is present
- Updated dependencies
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/plugin-auth-node@0.4.9-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0

## 0.1.0-next.0

### Minor Changes

- 1bedb23: Adds a new guest provider that maps guest users to actual tokens. This also shifts the default guest login to `user:development/guest` to reduce overlap with your production/real data. To change that (or set it back to the old default, use the new `auth.providers.guest.userEntityRef` config key) like so,

  ```yaml title=app-config.yaml
  auth:
    providers:
      guest:
        userEntityRef: user:default/guest
  ```

  This also adds a new property to control the ownership entity refs,

  ```yaml title=app-config.yaml
  auth:
    providers:
      guest:
        ownershipEntityRefs:
          - guests
          - development/custom
  ```

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.3-next.0
  - @backstage/plugin-auth-node@0.4.8-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/backend-plugin-api@0.6.13-next.0
  - @backstage/catalog-model@1.4.5-next.0
