# @backstage/plugin-permission-common

## 0.5.1

### Patch Changes

- Fix for the previous release with missing type declarations.
- Updated dependencies
  - @backstage/config@0.1.15
  - @backstage/errors@0.2.2

## 0.5.0

### Minor Changes

- 8c646beb24: **BREAKING** `PermissionCriteria` now requires at least one condition in `anyOf` and `allOf` arrays. This addresses some ambiguous behavior outlined in #9280.

### Patch Changes

- 1ed305728b: Bump `node-fetch` to version 2.6.7 and `cross-fetch` to version 3.1.5
- c77c5c7eb6: Added `backstage.role` to `package.json`
- Updated dependencies
  - @backstage/errors@0.2.1
  - @backstage/config@0.1.14

## 0.4.0

### Minor Changes

- b768259244: **BREAKING**: Authorize API request and response types have been updated. The existing `AuthorizeRequest` and `AuthorizeResponse` types now match the entire request and response objects for the /authorize endpoint, and new types `AuthorizeQuery` and `AuthorizeDecision` have been introduced for individual items in the request and response batches respectively.

  **BREAKING**: PermissionClient has been updated to use the new request and response format in the latest version of @backstage/permission-backend.

### Patch Changes

- Updated dependencies
  - @backstage/config@0.1.13

## 0.4.0-next.0

### Minor Changes

- b768259244: **BREAKING**: Authorize API request and response types have been updated. The existing `AuthorizeRequest` and `AuthorizeResponse` types now match the entire request and response objects for the /authorize endpoint, and new types `AuthorizeQuery` and `AuthorizeDecision` have been introduced for individual items in the request and response batches respectively.

  **BREAKING**: PermissionClient has been updated to use the new request and response format in the latest version of @backstage/permission-backend.

### Patch Changes

- Updated dependencies
  - @backstage/config@0.1.13-next.0

## 0.3.1

### Patch Changes

- Updated dependencies
  - @backstage/config@0.1.12
  - @backstage/errors@0.2.0

## 0.3.0

### Minor Changes

- 0e8ec6d974: - Add `PermissionAuthorizer` interface matching `PermissionClient` to allow alternative implementations like the `ServerPermissionClient` in @backstage/plugin-permission-node.

  Breaking Changes:

  - Remove "api" suffixes from constructor parameters in PermissionClient

  ```diff
    const { config, discovery } = options;
  -  const permissionClient = new PermissionClient({ discoveryApi: discovery, configApi: config });
  +  const permissionClient = new PermissionClient({ discovery, config });
  ```

## 0.2.0

### Minor Changes

- 92439056fb: Accept configApi rather than enabled flag in PermissionClient constructor.

### Patch Changes

- Updated dependencies
  - @backstage/errors@0.1.5
