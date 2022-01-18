# @backstage/plugin-permission-common

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
