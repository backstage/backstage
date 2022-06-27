# @backstage/plugin-permission-common

## 0.6.2

### Patch Changes

- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.

## 0.6.2-next.0

### Patch Changes

- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.

## 0.6.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.1

## 0.6.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.1-next.0

## 0.6.0

### Minor Changes

- 8012ac46a0: Add `resourceType` property to `PermissionCondition` type to allow matching them with `ResourcePermission` instances.
- c98d271466: Refactor api types into more specific, decoupled names.

  - **BREAKING:**
    - Renamed `AuthorizeDecision` to `EvaluatePermissionResponse`
    - Renamed `AuthorizeQuery` to `EvaluatePermissionRequest`
    - Renamed `AuthorizeRequest` to `EvaluatePermissionRequestBatch`
    - Renamed `AuthorizeResponse` to `EvaluatePermissionResponseBatch`
    - Renamed `Identified` to `IdentifiedPermissionMessage`
  - Add `PermissionMessageBatch` helper type
  - Add `ConditionalPolicyDecision`, `DefinitivePolicyDecision`, and `PolicyDecision` types from `@backstage/plugin-permission-node`

### Patch Changes

- 90754d4fa9: Removed [strict](https://github.com/colinhacks/zod#strict) validation from `PermissionCriteria` schemas to support backward-compatible changes.
- 2b07063d77: Added `PermissionEvaluator`, which will replace the existing `PermissionAuthorizer` interface. This new interface provides stronger type safety and validation by splitting `PermissionAuthorizer.authorize()` into two methods:

  - `authorize()`: Used when the caller requires a definitive decision.
  - `authorizeConditional()`: Used when the caller can optimize the evaluation of any conditional decisions. For example, a plugin backend may want to use conditions in a database query instead of evaluating each resource in memory.

- 8012ac46a0: Add `isPermission` helper method.
- 95284162d6: - Add more specific `Permission` types.
  - Add `createPermission` helper to infer the appropriate type for some permission input.
  - Add `isResourcePermission` helper to refine Permissions to ResourcePermissions.

## 0.6.0-next.1

### Patch Changes

- 2b07063d77: Added `PermissionEvaluator`, which will replace the existing `PermissionAuthorizer` interface. This new interface provides stronger type safety and validation by splitting `PermissionAuthorizer.authorize()` into two methods:

  - `authorize()`: Used when the caller requires a definitive decision.
  - `authorizeConditional()`: Used when the caller can optimize the evaluation of any conditional decisions. For example, a plugin backend may want to use conditions in a database query instead of evaluating each resource in memory.

## 0.6.0-next.0

### Minor Changes

- 8012ac46a0: Add `resourceType` property to `PermissionCondition` type to allow matching them with `ResourcePermission` instances.
- c98d271466: Refactor api types into more specific, decoupled names.

  - **BREAKING:**
    - Renamed `AuthorizeDecision` to `EvaluatePermissionResponse`
    - Renamed `AuthorizeQuery` to `EvaluatePermissionRequest`
    - Renamed `AuthorizeRequest` to `EvaluatePermissionRequestBatch`
    - Renamed `AuthorizeResponse` to `EvaluatePermissionResponseBatch`
    - Renamed `Identified` to `IdentifiedPermissionMessage`
  - Add `PermissionMessageBatch` helper type
  - Add `ConditionalPolicyDecision`, `DefinitivePolicyDecision`, and `PolicyDecision` types from `@backstage/plugin-permission-node`

### Patch Changes

- 8012ac46a0: Add `isPermission` helper method.
- 95284162d6: - Add more specific `Permission` types.
  - Add `createPermission` helper to infer the appropriate type for some permission input.
  - Add `isResourcePermission` helper to refine Permissions to ResourcePermissions.

## 0.5.3

### Patch Changes

- f24ef7864e: Minor typo fixes
- Updated dependencies
  - @backstage/config@1.0.0
  - @backstage/errors@1.0.0

## 0.5.2

### Patch Changes

- 79b9d8a861: Add api doc comments to `Permission` type properties.

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
