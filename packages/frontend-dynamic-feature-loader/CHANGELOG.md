# @backstage/frontend-dynamic-feature-loader

## 0.1.10-next.0

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.14.2-next.0
  - @backstage/config@1.3.6
  - @backstage/module-federation-common@0.1.0

## 0.1.9

### Patch Changes

- fdbd404: Updated module federation integration to use `@module-federation/enhanced/runtime` `createInstance` API and the new `loadModuleFederationHostShared` from `@backstage/module-federation-common` for loading shared dependencies. Also added support for passing a pre-created `ModuleFederation` instance via the `moduleFederation.instance` option.
- fdbd404: Updated `@module-federation/enhanced`, `@module-federation/runtime`, and `@module-federation/sdk` dependencies from `^0.9.0` to `^0.21.6`.
- a7e0d50: Updated `react-router-dom` peer dependency to `^6.30.2` and explicitly disabled v7 future flags to suppress deprecation warnings.
- Updated dependencies
  - @backstage/frontend-plugin-api@0.14.0
  - @backstage/module-federation-common@0.1.0

## 0.1.9-next.1

### Patch Changes

- a7e0d50: Prepare for React Router v7 migration by updating to v6.30.2 across all NFS packages and enabling v7 future flags. Convert routes from splat paths to parent/child structure with Outlet components.
- Updated dependencies
  - @backstage/frontend-plugin-api@0.14.0-next.2

## 0.1.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.14.0-next.0
  - @backstage/config@1.3.6

## 0.1.8

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.13.2

## 0.1.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.13.2-next.0
  - @backstage/config@1.3.6

## 0.1.7

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.13.0
  - @backstage/config@1.3.6

## 0.1.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.6-next.0
  - @backstage/frontend-plugin-api@0.12.2-next.0

## 0.1.6

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.12.1
  - @backstage/config@1.3.5

## 0.1.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.4-next.0
  - @backstage/frontend-plugin-api@0.12.1-next.1

## 0.1.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.12.1-next.0
  - @backstage/config@1.3.3

## 0.1.5

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.12.0

## 0.1.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.11.1-next.0

## 0.1.4

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.11.0

## 0.1.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.11.0-next.0
  - @backstage/config@1.3.3

## 0.1.3

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.3
  - @backstage/frontend-plugin-api@0.10.4

## 0.1.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.3-next.0
  - @backstage/frontend-plugin-api@0.10.4-next.1

## 0.1.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.2
  - @backstage/frontend-plugin-api@0.10.4-next.0

## 0.1.2

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.10.3
  - @backstage/config@1.3.2

## 0.1.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.10.3-next.1
  - @backstage/config@1.3.2

## 0.1.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.10.3-next.0

## 0.1.1

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.10.2
  - @backstage/config@1.3.2

## 0.1.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.2
  - @backstage/frontend-plugin-api@0.10.2-next.1

## 0.1.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.10.2-next.0
  - @backstage/config@1.3.2

## 0.1.0

### Minor Changes

- 3bee3c3: The new package `frontend-dynamic-features-loader` provides a frontend feature loader that dynamically
  loads frontend features based on the new frontend system and exposed as module federation remotes.
  This new frontend feature loader works hand-in-hand with a new server of frontend plugin module federation
  remotes, which is added as part of backend dynamic feature service in package `@backstage/backend-dynamic-feature-service`.

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.10.1
  - @backstage/config@1.3.2
