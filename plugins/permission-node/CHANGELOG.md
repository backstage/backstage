# @backstage/plugin-permission-node

## 0.8.8-next.0

### Patch Changes

- 049d5d4: The returned router from `createPermissionIntegrationRouter` is now mutable, allowing for permissions and resources to be added after creation of the router.
- Updated dependencies
  - @backstage/backend-plugin-api@1.2.0-next.0
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/plugin-auth-node@0.5.7-next.0
  - @backstage/plugin-permission-common@0.8.4

## 0.8.7

### Patch Changes

- d9d62ef: Remove some internal usages of the backend-common package
- Updated dependencies
  - @backstage/plugin-auth-node@0.5.6
  - @backstage/backend-plugin-api@1.1.1
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/plugin-permission-common@0.8.4

## 0.8.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.1.1-next.1
  - @backstage/config@1.3.2-next.0
  - @backstage/errors@1.2.7-next.0
  - @backstage/plugin-auth-node@0.5.6-next.1
  - @backstage/plugin-permission-common@0.8.4-next.0

## 0.8.7-next.0

### Patch Changes

- d9d62ef: Remove some internal usages of the backend-common package
- Updated dependencies
  - @backstage/plugin-auth-node@0.5.6-next.0
  - @backstage/backend-plugin-api@1.1.1-next.0
  - @backstage/config@1.3.1
  - @backstage/errors@1.2.6
  - @backstage/plugin-permission-common@0.8.3

## 0.8.6

### Patch Changes

- b149e2a: The `createPermissionIntegrationRouter` function now detects and prevents the exposure of duplicate permissions.
- Updated dependencies
  - @backstage/plugin-auth-node@0.5.5
  - @backstage/backend-plugin-api@1.1.0
  - @backstage/errors@1.2.6
  - @backstage/config@1.3.1
  - @backstage/plugin-permission-common@0.8.3

## 0.8.6-next.2

### Patch Changes

- b149e2a: The `createPermissionIntegrationRouter` function now detects and prevents the exposure of duplicate permissions.
- Updated dependencies
  - @backstage/backend-plugin-api@1.1.0-next.2
  - @backstage/errors@1.2.6-next.0
  - @backstage/plugin-auth-node@0.5.5-next.2
  - @backstage/config@1.3.1-next.0
  - @backstage/plugin-permission-common@0.8.3-next.0

## 0.8.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.5-next.1
  - @backstage/backend-plugin-api@1.1.0-next.1
  - @backstage/config@1.3.0
  - @backstage/errors@1.2.5
  - @backstage/plugin-permission-common@0.8.2

## 0.8.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.3-next.0
  - @backstage/plugin-auth-node@0.5.5-next.0
  - @backstage/config@1.3.0
  - @backstage/errors@1.2.5
  - @backstage/plugin-permission-common@0.8.2

## 0.8.5

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.0
  - @backstage/plugin-auth-node@0.5.4
  - @backstage/backend-plugin-api@1.0.2
  - @backstage/plugin-permission-common@0.8.2
  - @backstage/errors@1.2.5

## 0.8.5-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.4-next.2
  - @backstage/backend-plugin-api@1.0.2-next.2
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-permission-common@0.8.1

## 0.8.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.2-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-auth-node@0.5.4-next.1
  - @backstage/plugin-permission-common@0.8.1

## 0.8.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.4-next.0
  - @backstage/backend-plugin-api@1.0.2-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-permission-common@0.8.1

## 0.8.4

### Patch Changes

- 094eaa3: Remove references to in-repo backend-common
- Updated dependencies
  - @backstage/plugin-auth-node@0.5.3
  - @backstage/backend-plugin-api@1.0.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-permission-common@0.8.1

## 0.8.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.3-next.1
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-permission-common@0.8.1

## 0.8.4-next.0

### Patch Changes

- 094eaa3: Remove references to in-repo backend-common
- Updated dependencies
  - @backstage/plugin-auth-node@0.5.3-next.0
  - @backstage/backend-plugin-api@1.0.1-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-permission-common@0.8.1

## 0.8.3

### Patch Changes

- 19ff127: Internal refactor to remove dependencies on the identity and token manager services, which have been removed. Public APIs no longer require the identity service or token manager to be provided.
- c2b63ab: Updated dependency `supertest` to `^7.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.25.0
  - @backstage/backend-plugin-api@1.0.0
  - @backstage/plugin-auth-node@0.5.2
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-permission-common@0.8.1

## 0.8.3-next.2

### Patch Changes

- c2b63ab: Updated dependency `supertest` to `^7.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.25.0-next.2
  - @backstage/plugin-auth-node@0.5.2-next.2
  - @backstage/backend-plugin-api@1.0.0-next.2
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-permission-common@0.8.1

## 0.8.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.25.0-next.1
  - @backstage/plugin-auth-node@0.5.2-next.1
  - @backstage/backend-plugin-api@0.9.0-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-permission-common@0.8.1

## 0.8.3-next.0

### Patch Changes

- 19ff127: Internal refactor to remove dependencies on the identity and token manager services, which have been removed. Public APIs no longer require the identity service or token manager to be provided.
- Updated dependencies
  - @backstage/backend-plugin-api@0.9.0-next.0
  - @backstage/backend-common@0.25.0-next.0
  - @backstage/plugin-auth-node@0.5.2-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-permission-common@0.8.1

## 0.8.1

### Patch Changes

- df784fe: The MetadataResponse type has been moved to @backstage/plugin-permission-common
  to match the recent move of MetadataResponseSerializedRule, and should be
  imported from there going forward. To avoid an immediate breaking change, this
  type is still re-exported from this package, but is marked as deprecated and
  will be removed in a future release.
- 5cd9878: The MetadataResponseSerializedRule type has been moved to @backstage/plugin-permission-common, and should be imported from there going forward. To avoid an immediate breaking change, this type is still re-exported from this package, but is marked as deprecated and will be removed in a future release.
- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0
  - @backstage/backend-common@0.24.0
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-auth-node@0.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.8.1-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.3
  - @backstage/backend-common@0.23.4-next.3
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-auth-node@0.5.0-next.3
  - @backstage/plugin-permission-common@0.8.1-next.1

## 0.8.1-next.2

### Patch Changes

- df784fe: The MetadataResponse type has been moved to @backstage/plugin-permission-common
  to match the recent move of MetadataResponseSerializedRule, and should be
  imported from there going forward. To avoid an immediate breaking change, this
  type is still re-exported from this package, but is marked as deprecated and
  will be removed in a future release.
- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.2
  - @backstage/plugin-permission-common@0.8.1-next.1
  - @backstage/backend-common@0.23.4-next.2
  - @backstage/plugin-auth-node@0.5.0-next.2
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.8.1-next.1

### Patch Changes

- 5cd9878: The MetadataResponseSerializedRule type has been moved to @backstage/plugin-permission-common, and should be imported from there going forward. To avoid an immediate breaking change, this type is still re-exported from this package, but is marked as deprecated and will be removed in a future release.
- Updated dependencies
  - @backstage/plugin-permission-common@0.8.1-next.0
  - @backstage/backend-plugin-api@0.7.1-next.1
  - @backstage/backend-common@0.23.4-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-auth-node@0.4.18-next.1

## 0.8.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.23.4-next.0
  - @backstage/backend-plugin-api@0.7.1-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-auth-node@0.4.18-next.0
  - @backstage/plugin-permission-common@0.8.0

## 0.8.0

### Minor Changes

- 36f91e8: **BREAKING**: Updated the `ServerPermissionClient` to match the new `PermissionsService` interface, where the deprecated `token` option has been removed and the options are now required.

### Patch Changes

- ed10fd2: The `PermissionPolicy` interface has been updated to align with the recent changes to the Backstage auth system. The second argument to the `handle` method is now of the new `PolicyQueryUser` type. This type maintains the old fields from the `BackstageIdentityResponse`, which are now all deprecated. Instead, two new fields have been added, which allows access to the same information:

  - `credentials` - A `BackstageCredentials` object, which is useful for making requests to other services on behalf of the user as part of evaluating the policy. This replaces the deprecated `token` field. See the [Auth Service documentation](https://backstage.io/docs/backend-system/core-services/auth#creating-request-tokens) for information about how to create a token using these credentials.
  - `info` - A `BackstageUserInfo` object, which contains the same information as the deprecated `identity`, except for the `type` field that was redundant.

  Most existing policies can be updated by replacing the `BackstageIdentityResponse` type with `PolicyQueryUser`, which is exported from `@backstage/plugin-permission-node`, as well as replacing any occurrences of `user?.identity` with `user?.info`.

- 28b2cfb: Fix invalid cross-reference in API Reference docs
- Updated dependencies
  - @backstage/backend-plugin-api@0.7.0
  - @backstage/backend-common@0.23.3
  - @backstage/plugin-permission-common@0.8.0
  - @backstage/plugin-auth-node@0.4.17
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.7.33-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.23.3-next.1
  - @backstage/backend-plugin-api@0.6.22-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-auth-node@0.4.17-next.1
  - @backstage/plugin-permission-common@0.7.14

## 0.7.32-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.21-next.0
  - @backstage/backend-common@0.23.2-next.0
  - @backstage/plugin-auth-node@0.4.16-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-permission-common@0.7.14

## 0.7.30

### Patch Changes

- 9e63318: Ensure that service token access restrictions, when present, are taken into account
- d44a20a: Added additional plugin metadata to `package.json`.
- c7b0dd1: Import `tokenManager` definition from `@backstage/backend-plugin-api`
- Updated dependencies
  - @backstage/backend-common@0.23.0
  - @backstage/backend-plugin-api@0.6.19
  - @backstage/plugin-auth-node@0.4.14
  - @backstage/plugin-permission-common@0.7.14
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.7.30-next.3

### Patch Changes

- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.3
  - @backstage/plugin-auth-node@0.4.14-next.3
  - @backstage/plugin-permission-common@0.7.14-next.0
  - @backstage/backend-common@0.23.0-next.3
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.7.30-next.2

### Patch Changes

- c7b0dd1: Import `tokenManager` definition from `@backstage/backend-plugin-api`
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.2
  - @backstage/backend-common@0.23.0-next.2
  - @backstage/plugin-auth-node@0.4.14-next.2
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-permission-common@0.7.13

## 0.7.30-next.1

### Patch Changes

- 9e63318: Ensure that service token access restrictions, when present, are taken into account
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.1
  - @backstage/backend-common@0.23.0-next.1
  - @backstage/plugin-auth-node@0.4.14-next.1

## 0.7.30-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.22.1-next.0
  - @backstage/backend-plugin-api@0.6.19-next.0
  - @backstage/plugin-auth-node@0.4.14-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-permission-common@0.7.13

## 0.7.29

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.22.0
  - @backstage/backend-plugin-api@0.6.18
  - @backstage/plugin-auth-node@0.4.13

## 0.7.29-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.22.0-next.1
  - @backstage/plugin-auth-node@0.4.13-next.1
  - @backstage/backend-plugin-api@0.6.18-next.1

## 0.7.29-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.4.13-next.0
  - @backstage/backend-common@0.21.8-next.0
  - @backstage/backend-plugin-api@0.6.18-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-permission-common@0.7.13

## 0.7.28

### Patch Changes

- 29fa05b: Fixed an issue causing `ServerPermissionClient` to generate an invalid token for authorizing permissions against the permission backend.
- Updated dependencies
  - @backstage/backend-common@0.21.7
  - @backstage/backend-plugin-api@0.6.17
  - @backstage/plugin-auth-node@0.4.12
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-permission-common@0.7.13

## 0.7.28-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.7-next.1
  - @backstage/backend-plugin-api@0.6.17-next.1
  - @backstage/plugin-auth-node@0.4.12-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-permission-common@0.7.13

## 0.7.28-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.7-next.0
  - @backstage/backend-plugin-api@0.6.17-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-auth-node@0.4.12-next.0
  - @backstage/plugin-permission-common@0.7.13

## 0.7.27

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.4.11
  - @backstage/backend-common@0.21.6
  - @backstage/backend-plugin-api@0.6.16
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-permission-common@0.7.13

## 0.7.26

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.5
  - @backstage/plugin-auth-node@0.4.10
  - @backstage/backend-plugin-api@0.6.15
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-permission-common@0.7.13

## 0.7.25

### Patch Changes

- 0502d82: The `ServerPermissionClient` has been migrated to implement the `PermissionsService` interface, now accepting the new `BackstageCredentials` object in addition to the `token` option, which is now deprecated. It now also optionally depends on the new `AuthService`.
- Updated dependencies
  - @backstage/backend-common@0.21.4
  - @backstage/plugin-auth-node@0.4.9
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/backend-plugin-api@0.6.14
  - @backstage/plugin-permission-common@0.7.13

## 0.7.25-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.4-next.2
  - @backstage/plugin-auth-node@0.4.9-next.2
  - @backstage/backend-plugin-api@0.6.14-next.2
  - @backstage/config@1.2.0-next.1
  - @backstage/errors@1.2.4-next.0
  - @backstage/plugin-permission-common@0.7.13-next.1

## 0.7.25-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/plugin-auth-node@0.4.9-next.1
  - @backstage/plugin-permission-common@0.7.13-next.1
  - @backstage/errors@1.2.4-next.0

## 0.7.24-next.0

### Patch Changes

- 0502d82: The `ServerPermissionClient` has been migrated to implement the `PermissionsService` interface, now accepting the new `BackstageCredentials` object in addition to the `token` option, which is now deprecated. It now also optionally depends on the new `AuthService`.
- Updated dependencies
  - @backstage/backend-common@0.21.3-next.0
  - @backstage/plugin-auth-node@0.4.8-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/backend-plugin-api@0.6.13-next.0
  - @backstage/plugin-permission-common@0.7.13-next.0
  - @backstage/config@1.1.2-next.0

## 0.7.21

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0
  - @backstage/plugin-auth-node@0.4.4
  - @backstage/backend-plugin-api@0.6.10
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-permission-common@0.7.12

## 0.7.21-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.3
  - @backstage/plugin-auth-node@0.4.4-next.3
  - @backstage/backend-plugin-api@0.6.10-next.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-permission-common@0.7.12

## 0.7.21-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.2
  - @backstage/backend-plugin-api@0.6.10-next.2
  - @backstage/plugin-auth-node@0.4.4-next.2
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-permission-common@0.7.12

## 0.7.21-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.10-next.1
  - @backstage/backend-common@0.21.0-next.1
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-auth-node@0.4.4-next.1
  - @backstage/plugin-permission-common@0.7.12

## 0.7.21-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.0
  - @backstage/plugin-auth-node@0.4.4-next.0
  - @backstage/backend-plugin-api@0.6.10-next.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-permission-common@0.7.12

## 0.7.20

### Patch Changes

- b1acd9b: Updated README
- Updated dependencies
  - @backstage/backend-common@0.20.1
  - @backstage/backend-plugin-api@0.6.9
  - @backstage/plugin-permission-common@0.7.12
  - @backstage/plugin-auth-node@0.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3

## 0.7.20-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.9-next.2
  - @backstage/backend-common@0.20.1-next.2
  - @backstage/plugin-auth-node@0.4.3-next.2

## 0.7.20-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1-next.1
  - @backstage/config@1.1.1
  - @backstage/plugin-auth-node@0.4.3-next.1
  - @backstage/backend-plugin-api@0.6.9-next.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-permission-common@0.7.11

## 0.7.20-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1-next.0
  - @backstage/backend-plugin-api@0.6.9-next.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-auth-node@0.4.3-next.0
  - @backstage/plugin-permission-common@0.7.11

## 0.7.19

### Patch Changes

- 0cbb03b: Fixing regular expression ReDoS with zod packages. Upgrading to latest. ref: https://security.snyk.io/vuln/SNYK-JS-ZOD-5925617
- Updated dependencies
  - @backstage/backend-common@0.20.0
  - @backstage/plugin-auth-node@0.4.2
  - @backstage/plugin-permission-common@0.7.11
  - @backstage/backend-plugin-api@0.6.8
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3

## 0.7.19-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.3
  - @backstage/backend-plugin-api@0.6.8-next.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-auth-node@0.4.2-next.3
  - @backstage/plugin-permission-common@0.7.10

## 0.7.19-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.2
  - @backstage/plugin-auth-node@0.4.2-next.2
  - @backstage/backend-plugin-api@0.6.8-next.2
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-permission-common@0.7.10

## 0.7.19-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-auth-node@0.4.2-next.1
  - @backstage/plugin-permission-common@0.7.10

## 0.7.19-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.0
  - @backstage/plugin-auth-node@0.4.2-next.0
  - @backstage/backend-plugin-api@0.6.8-next.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-permission-common@0.7.10

## 0.7.18

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.9
  - @backstage/backend-plugin-api@0.6.7
  - @backstage/plugin-permission-common@0.7.10
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-auth-node@0.4.1

## 0.7.18-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.7-next.2
  - @backstage/backend-common@0.19.9-next.2
  - @backstage/plugin-auth-node@0.4.1-next.2

## 0.7.18-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.9-next.1
  - @backstage/plugin-auth-node@0.4.1-next.1
  - @backstage/backend-plugin-api@0.6.7-next.1
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-permission-common@0.7.9

## 0.7.18-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.9-next.0
  - @backstage/backend-plugin-api@0.6.7-next.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-auth-node@0.4.1-next.0
  - @backstage/plugin-permission-common@0.7.9

## 0.7.17

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/plugin-auth-node@0.4.0
  - @backstage/errors@1.2.3
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/config@1.1.1
  - @backstage/plugin-permission-common@0.7.9

## 0.7.17-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8-next.2
  - @backstage/plugin-auth-node@0.4.0-next.2
  - @backstage/errors@1.2.3-next.0
  - @backstage/backend-plugin-api@0.6.6-next.2
  - @backstage/config@1.1.1-next.0
  - @backstage/plugin-permission-common@0.7.9-next.0

## 0.7.16-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.7-next.1
  - @backstage/backend-plugin-api@0.6.5-next.1
  - @backstage/plugin-auth-node@0.3.2-next.1
  - @backstage/config@1.1.0
  - @backstage/errors@1.2.2
  - @backstage/plugin-permission-common@0.7.8

## 0.7.16-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.3.2-next.0
  - @backstage/backend-common@0.19.7-next.0
  - @backstage/config@1.1.0
  - @backstage/backend-plugin-api@0.6.5-next.0
  - @backstage/errors@1.2.2
  - @backstage/plugin-permission-common@0.7.8

## 0.7.14

### Patch Changes

- a8a614ba0d07: Minor `package.json` update.
- Updated dependencies
  - @backstage/backend-common@0.19.5
  - @backstage/plugin-auth-node@0.3.0
  - @backstage/config@1.1.0
  - @backstage/errors@1.2.2
  - @backstage/plugin-permission-common@0.7.8
  - @backstage/backend-plugin-api@0.6.3

## 0.7.14-next.3

### Patch Changes

- a8a614ba0d07: Minor `package.json` update.
- Updated dependencies
  - @backstage/config@1.1.0-next.2
  - @backstage/errors@1.2.2-next.0
  - @backstage/plugin-permission-common@0.7.8-next.2
  - @backstage/backend-plugin-api@0.6.3-next.3
  - @backstage/backend-common@0.19.5-next.3
  - @backstage/plugin-auth-node@0.3.0-next.3

## 0.7.14-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/plugin-auth-node@0.3.0-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/plugin-permission-common@0.7.8-next.1
  - @backstage/errors@1.2.1

## 0.7.14-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.0
  - @backstage/backend-common@0.19.5-next.1
  - @backstage/backend-plugin-api@0.6.3-next.1
  - @backstage/plugin-auth-node@0.3.0-next.1
  - @backstage/plugin-permission-common@0.7.8-next.0
  - @backstage/errors@1.2.1

## 0.7.13-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.3.0-next.0
  - @backstage/backend-common@0.19.4-next.0
  - @backstage/backend-plugin-api@0.6.2-next.0
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/plugin-permission-common@0.7.7

## 0.7.11

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.2
  - @backstage/backend-plugin-api@0.6.0
  - @backstage/plugin-auth-node@0.2.17
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/plugin-permission-common@0.7.7

## 0.7.11-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-common@0.19.2-next.2
  - @backstage/plugin-auth-node@0.2.17-next.2

## 0.7.11-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.2-next.1
  - @backstage/plugin-auth-node@0.2.17-next.1
  - @backstage/backend-plugin-api@0.6.0-next.1
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/plugin-permission-common@0.7.7

## 0.7.11-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.2-next.0
  - @backstage/backend-plugin-api@0.5.5-next.0
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/plugin-auth-node@0.2.17-next.0
  - @backstage/plugin-permission-common@0.7.7

## 0.7.10

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.1
  - @backstage/backend-common@0.19.1
  - @backstage/backend-plugin-api@0.5.4
  - @backstage/config@1.0.8
  - @backstage/plugin-auth-node@0.2.16
  - @backstage/plugin-permission-common@0.7.7

## 0.7.10-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.1-next.0
  - @backstage/backend-common@0.19.1-next.0
  - @backstage/backend-plugin-api@0.5.4-next.0
  - @backstage/config@1.0.8
  - @backstage/plugin-auth-node@0.2.16-next.0
  - @backstage/plugin-permission-common@0.7.7-next.0

## 0.7.9

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0
  - @backstage/errors@1.2.0
  - @backstage/backend-plugin-api@0.5.3
  - @backstage/plugin-auth-node@0.2.15
  - @backstage/config@1.0.8
  - @backstage/plugin-permission-common@0.7.6

## 0.7.9-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0-next.2
  - @backstage/backend-plugin-api@0.5.3-next.2
  - @backstage/config@1.0.7
  - @backstage/errors@1.2.0-next.0
  - @backstage/plugin-auth-node@0.2.15-next.2
  - @backstage/plugin-permission-common@0.7.6-next.0

## 0.7.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0-next.1
  - @backstage/errors@1.2.0-next.0
  - @backstage/backend-plugin-api@0.5.3-next.1
  - @backstage/plugin-auth-node@0.2.15-next.1
  - @backstage/plugin-permission-common@0.7.6-next.0
  - @backstage/config@1.0.7

## 0.7.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.6-next.0
  - @backstage/config@1.0.7
  - @backstage/backend-plugin-api@0.5.3-next.0
  - @backstage/errors@1.1.5
  - @backstage/plugin-auth-node@0.2.15-next.0
  - @backstage/plugin-permission-common@0.7.5

## 0.7.8

### Patch Changes

- a788e715cfc: `createPermissionIntegrationRouter` now accepts rules and permissions for multiple resource types. Example:

  ```typescript
  createPermissionIntegrationRouter({
    resources: [
      {
        resourceType: 'resourceType-1',
        permissions: permissionsResourceType1,
        rules: rulesResourceType1,
      },
      {
        resourceType: 'resourceType-2',
        permissions: permissionsResourceType2,
        rules: rulesResourceType2,
      },
    ],
  });
  ```

- Updated dependencies
  - @backstage/backend-common@0.18.5
  - @backstage/plugin-auth-node@0.2.14
  - @backstage/backend-plugin-api@0.5.2
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/plugin-permission-common@0.7.5

## 0.7.8-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/plugin-auth-node@0.2.14-next.1
  - @backstage/backend-plugin-api@0.5.2-next.1
  - @backstage/config@1.0.7

## 0.7.8-next.0

### Patch Changes

- a788e715cfc: `createPermissionIntegrationRouter` now accepts rules and permissions for multiple resource types. Example:

  ```typescript
  createPermissionIntegrationRouter({
    resources: [
      {
        resourceType: 'resourceType-1',
        permissions: permissionsResourceType1,
        rules: rulesResourceType1,
      },
      {
        resourceType: 'resourceType-2',
        permissions: permissionsResourceType2,
        rules: rulesResourceType2,
      },
    ],
  });
  ```

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.0
  - @backstage/plugin-auth-node@0.2.14-next.0
  - @backstage/backend-plugin-api@0.5.2-next.0
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/plugin-permission-common@0.7.5

## 0.7.7

### Patch Changes

- 788f0f5a152: Introduced alpha export of the `policyExtensionPoint` for use in the new backend system.
- 71fd0966d10: Added createConditionAuthorizer utility function, which takes some permission conditions and returns a function that returns a definitive authorization result given a decision and a resource.
- 1e4f5e91b8e: Bump `zod` and `zod-to-json-schema` dependencies.
- Updated dependencies
  - @backstage/backend-common@0.18.4
  - @backstage/plugin-permission-common@0.7.5
  - @backstage/plugin-auth-node@0.2.13
  - @backstage/backend-plugin-api@0.5.1
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5

## 0.7.7-next.2

### Patch Changes

- 788f0f5a152: Introduced alpha export of the `policyExtensionPoint` for use in the new backend system.
- Updated dependencies
  - @backstage/backend-common@0.18.4-next.2
  - @backstage/backend-plugin-api@0.5.1-next.2
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/plugin-auth-node@0.2.13-next.2
  - @backstage/plugin-permission-common@0.7.5-next.0

## 0.7.7-next.1

### Patch Changes

- 71fd0966d10: Added createConditionAuthorizer utility function, which takes some permission conditions and returns a function that returns a definitive authorization result given a decision and a resource.
- 1e4f5e91b8e: Bump `zod` and `zod-to-json-schema` dependencies.
- Updated dependencies
  - @backstage/plugin-permission-common@0.7.5-next.0
  - @backstage/backend-common@0.18.4-next.1
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/plugin-auth-node@0.2.13-next.1

## 0.7.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.4-next.0
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/plugin-auth-node@0.2.13-next.0
  - @backstage/plugin-permission-common@0.7.4

## 0.7.6

### Patch Changes

- 27a103ca07b: Changed the `createPermissionIntegrationRouter` API to allow `getResources`, `resourceType` and `rules` to be optional
- 37e9215c793: Update the service-to-service auth docs URL in error message.
  ``
- 52b0022dab7: Updated dependency `msw` to `^1.0.0`.
- Updated dependencies
  - @backstage/plugin-auth-node@0.2.12
  - @backstage/backend-common@0.18.3
  - @backstage/errors@1.1.5
  - @backstage/plugin-permission-common@0.7.4
  - @backstage/config@1.0.7

## 0.7.6-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.2.12-next.2
  - @backstage/backend-common@0.18.3-next.2
  - @backstage/config@1.0.7-next.0

## 0.7.6-next.1

### Patch Changes

- 27a103ca07b: Changed the `createPermissionIntegrationRouter` API to allow `getResources`, `resourceType` and `rules` to be optional
- 37e9215c793: Update the service-to-service auth docs URL in error message.
  ``
- 52b0022dab7: Updated dependency `msw` to `^1.0.0`.
- Updated dependencies
  - @backstage/errors@1.1.5-next.0
  - @backstage/backend-common@0.18.3-next.1
  - @backstage/plugin-auth-node@0.2.12-next.1
  - @backstage/plugin-permission-common@0.7.4-next.0
  - @backstage/config@1.0.7-next.0

## 0.7.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.3-next.0
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/plugin-auth-node@0.2.12-next.0
  - @backstage/plugin-permission-common@0.7.3

## 0.7.5

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.2
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/plugin-auth-node@0.2.11
  - @backstage/plugin-permission-common@0.7.3

## 0.7.5-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.2-next.2
  - @backstage/plugin-auth-node@0.2.11-next.2
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/plugin-permission-common@0.7.3

## 0.7.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.2-next.1
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/plugin-auth-node@0.2.11-next.1
  - @backstage/plugin-permission-common@0.7.3

## 0.7.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.2-next.0
  - @backstage/plugin-auth-node@0.2.11-next.0

## 0.7.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.0
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/plugin-auth-node@0.2.9
  - @backstage/plugin-permission-common@0.7.3

## 0.7.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.0-next.1
  - @backstage/plugin-auth-node@0.2.9-next.1
  - @backstage/config@1.0.6-next.0
  - @backstage/errors@1.1.4
  - @backstage/plugin-permission-common@0.7.3-next.0

## 0.7.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/errors@1.1.4
  - @backstage/plugin-auth-node@0.2.9-next.0
  - @backstage/plugin-permission-common@0.7.3-next.0

## 0.7.2

### Patch Changes

- b05dcd5530: Move the `zod` dependency to a version that does not collide with other libraries
- 3280711113: Updated dependency `msw` to `^0.49.0`.
- Updated dependencies
  - @backstage/backend-common@0.17.0
  - @backstage/plugin-permission-common@0.7.2
  - @backstage/errors@1.1.4
  - @backstage/plugin-auth-node@0.2.8
  - @backstage/config@1.0.5

## 0.7.2-next.3

### Patch Changes

- b05dcd5530: Move the `zod` dependency to a version that does not collide with other libraries
- Updated dependencies
  - @backstage/plugin-permission-common@0.7.2-next.2
  - @backstage/backend-common@0.17.0-next.3
  - @backstage/config@1.0.5-next.1
  - @backstage/errors@1.1.4-next.1
  - @backstage/plugin-auth-node@0.2.8-next.3

## 0.7.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.17.0-next.2
  - @backstage/plugin-auth-node@0.2.8-next.2
  - @backstage/config@1.0.5-next.1
  - @backstage/errors@1.1.4-next.1
  - @backstage/plugin-permission-common@0.7.2-next.1

## 0.7.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.17.0-next.1
  - @backstage/plugin-auth-node@0.2.8-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/errors@1.1.4-next.1
  - @backstage/plugin-permission-common@0.7.2-next.1

## 0.7.2-next.0

### Patch Changes

- 3280711113: Updated dependency `msw` to `^0.49.0`.
- Updated dependencies
  - @backstage/backend-common@0.16.1-next.0
  - @backstage/plugin-auth-node@0.2.8-next.0
  - @backstage/plugin-permission-common@0.7.2-next.0
  - @backstage/config@1.0.5-next.0
  - @backstage/errors@1.1.4-next.0

## 0.7.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.16.0
  - @backstage/plugin-auth-node@0.2.7
  - @backstage/plugin-permission-common@0.7.1
  - @backstage/config@1.0.4
  - @backstage/errors@1.1.3

## 0.7.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.16.0-next.1
  - @backstage/plugin-auth-node@0.2.7-next.1
  - @backstage/config@1.0.4-next.0
  - @backstage/errors@1.1.3-next.0
  - @backstage/plugin-permission-common@0.7.1-next.0

## 0.7.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.16.0-next.0
  - @backstage/plugin-auth-node@0.2.7-next.0
  - @backstage/plugin-permission-common@0.7.1-next.0
  - @backstage/config@1.0.4-next.0
  - @backstage/errors@1.1.3-next.0

## 0.7.0

### Minor Changes

- 46b4a72cee: **BREAKING**: When defining permission rules, it's now necessary to provide a [ZodSchema](https://github.com/colinhacks/zod) that specifies the parameters the rule expects. This has been added to help better describe the parameters in the response of the metadata endpoint and to validate the parameters before a rule is executed.

  To help with this, we have also made a change to the API of permission rules. Before, the permission rules `toQuery` and `apply` signature expected parameters to be separate arguments, like so...

  ```ts
  createPermissionRule({
    apply: (resource, foo, bar) => true,
    toQuery: (foo, bar) => {},
  });
  ```

  The API has now changed to expect the parameters as a single object

  ```ts
  createPermissionRule({
    paramSchema: z.object({
      foo: z.string().describe('Foo value to match'),
      bar: z.string().describe('Bar value to match'),
    }),
    apply: (resource, { foo, bar }) => true,
    toQuery: ({ foo, bar }) => {},
  });
  ```

  One final change made is to limit the possible values for a parameter to primitives and arrays of primitives.

### Patch Changes

- 9335ad115e: Exported types for the .metadata endpoint of the permission router
- Updated dependencies
  - @backstage/backend-common@0.15.2
  - @backstage/plugin-auth-node@0.2.6
  - @backstage/plugin-permission-common@0.7.0
  - @backstage/config@1.0.3
  - @backstage/errors@1.1.2

## 0.7.0-next.2

### Minor Changes

- 46b4a72cee: **BREAKING**: When defining permission rules, it's now necessary to provide a [ZodSchema](https://github.com/colinhacks/zod) that specifies the parameters the rule expects. This has been added to help better describe the parameters in the response of the metadata endpoint and to validate the parameters before a rule is executed.

  To help with this, we have also made a change to the API of permission rules. Before, the permission rules `toQuery` and `apply` signature expected parameters to be separate arguments, like so...

  ```ts
  createPermissionRule({
    apply: (resource, foo, bar) => true,
    toQuery: (foo, bar) => {},
  });
  ```

  The API has now changed to expect the parameters as a single object

  ```ts
  createPermissionRule({
    paramSchema: z.object({
      foo: z.string().describe('Foo value to match'),
      bar: z.string().describe('Bar value to match'),
    }),
    apply: (resource, { foo, bar }) => true,
    toQuery: ({ foo, bar }) => {},
  });
  ```

  One final change made is to limit the possible values for a parameter to primitives and arrays of primitives.

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.2-next.2
  - @backstage/plugin-permission-common@0.7.0-next.2
  - @backstage/plugin-auth-node@0.2.6-next.2
  - @backstage/config@1.0.3-next.2
  - @backstage/errors@1.1.2-next.2

## 0.6.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.2-next.1
  - @backstage/config@1.0.3-next.1
  - @backstage/errors@1.1.2-next.1
  - @backstage/plugin-auth-node@0.2.6-next.1
  - @backstage/plugin-permission-common@0.6.5-next.1

## 0.6.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.2-next.0
  - @backstage/plugin-auth-node@0.2.6-next.0
  - @backstage/config@1.0.3-next.0
  - @backstage/errors@1.1.2-next.0
  - @backstage/plugin-permission-common@0.6.5-next.0

## 0.6.5

### Patch Changes

- 9212439d15: Minor update to tests
- 667d917488: Updated dependency `msw` to `^0.47.0`.
- 87ec2ba4d6: Updated dependency `msw` to `^0.46.0`.
- bf5e9030eb: Updated dependency `msw` to `^0.45.0`.
- Updated dependencies
  - @backstage/backend-common@0.15.1
  - @backstage/plugin-auth-node@0.2.5
  - @backstage/config@1.0.2
  - @backstage/errors@1.1.1
  - @backstage/plugin-permission-common@0.6.4

## 0.6.5-next.3

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.2-next.0
  - @backstage/errors@1.1.1-next.0
  - @backstage/plugin-permission-common@0.6.4-next.2
  - @backstage/backend-common@0.15.1-next.3
  - @backstage/plugin-auth-node@0.2.5-next.3

## 0.6.5-next.2

### Patch Changes

- 667d917488: Updated dependency `msw` to `^0.47.0`.
- 87ec2ba4d6: Updated dependency `msw` to `^0.46.0`.
- Updated dependencies
  - @backstage/backend-common@0.15.1-next.2
  - @backstage/plugin-auth-node@0.2.5-next.2
  - @backstage/plugin-permission-common@0.6.4-next.1

## 0.6.5-next.1

### Patch Changes

- 9212439d15: Minor update to tests
- Updated dependencies
  - @backstage/plugin-auth-node@0.2.5-next.1
  - @backstage/backend-common@0.15.1-next.1

## 0.6.5-next.0

### Patch Changes

- bf5e9030eb: Updated dependency `msw` to `^0.45.0`.
- Updated dependencies
  - @backstage/backend-common@0.15.1-next.0
  - @backstage/plugin-auth-node@0.2.5-next.0
  - @backstage/plugin-permission-common@0.6.4-next.0

## 0.6.4

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.0
  - @backstage/plugin-auth-node@0.2.4

## 0.6.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.0-next.0
  - @backstage/plugin-auth-node@0.2.4-next.0

## 0.6.3

### Patch Changes

- a70869e775: Updated dependency `msw` to `^0.43.0`.
- 8006d0f9bf: Updated dependency `msw` to `^0.44.0`.
- Updated dependencies
  - @backstage/backend-common@0.14.1
  - @backstage/plugin-auth-node@0.2.3
  - @backstage/plugin-permission-common@0.6.3
  - @backstage/errors@1.1.0

## 0.6.3-next.2

### Patch Changes

- a70869e775: Updated dependency `msw` to `^0.43.0`.
- Updated dependencies
  - @backstage/backend-common@0.14.1-next.3
  - @backstage/plugin-auth-node@0.2.3-next.2
  - @backstage/plugin-permission-common@0.6.3-next.1

## 0.6.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.14.1-next.1
  - @backstage/errors@1.1.0-next.0
  - @backstage/plugin-auth-node@0.2.3-next.1
  - @backstage/plugin-permission-common@0.6.3-next.0

## 0.6.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.14.1-next.0
  - @backstage/plugin-auth-node@0.2.3-next.0

## 0.6.2

### Patch Changes

- 58426f9c0f: Added a new endpoint for aggregating permission metadata from a plugin backend: `/.well-known/backstage/permissions/metadata`

  By default, the metadata endpoint will return information about the permission rules supported by the plugin. Plugin authors can also provide an optional `permissions` parameter to `createPermissionIntegrationRouter`. If provided, these `Permission` objects will be included in the metadata returned by this endpoint. The `permissions` parameter will eventually be required in a future breaking change.

- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- Updated dependencies
  - @backstage/backend-common@0.14.0
  - @backstage/plugin-auth-node@0.2.2
  - @backstage/plugin-permission-common@0.6.2

## 0.6.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.14.0-next.2
  - @backstage/plugin-auth-node@0.2.2-next.2

## 0.6.2-next.1

### Patch Changes

- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- Updated dependencies
  - @backstage/backend-common@0.13.6-next.1
  - @backstage/plugin-auth-node@0.2.2-next.1
  - @backstage/plugin-permission-common@0.6.2-next.0

## 0.6.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.6-next.0
  - @backstage/plugin-auth-node@0.2.2-next.0

## 0.6.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.3
  - @backstage/config@1.0.1
  - @backstage/plugin-auth-node@0.2.1
  - @backstage/plugin-permission-common@0.6.1

## 0.6.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.3-next.2
  - @backstage/config@1.0.1-next.0
  - @backstage/plugin-auth-node@0.2.1-next.1
  - @backstage/plugin-permission-common@0.6.1-next.0

## 0.6.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.3-next.0
  - @backstage/plugin-auth-node@0.2.1-next.0

## 0.6.0

### Minor Changes

- 8012ac46a0: **BREAKING**: Stronger typing in `PermissionPolicy` 🎉.

  Previously, it was entirely the responsibility of the `PermissionPolicy` author to only return `CONDITIONAL` decisions for permissions that are associated with a resource, and to return the correct kind of `PermissionCondition` instances inside the decision. Now, the policy authoring helpers provided in this package now ensure that the decision and permission match.

  **For policy authors**: rename and adjust api of `createConditionExports`. Previously, the function returned a factory for creating conditional decisions named `createPolicyDecision`, which had a couple of drawbacks:

  1. The function always creates a _conditional_ policy decision, but this was not reflected in the name.
  2. Conditional decisions should only ever be returned from `PermissionPolicy#handle` for resource permissions, but there was nothing in the API that encoded this constraint.

  This change addresses the drawbacks above by making the following changes for policy authors:

  - The `createPolicyDecision` method has been renamed to `createConditionalDecision`.
  - Along with conditions, the method now accepts a permission, which must be a `ResourcePermission`. This is expected to be the handled permission in `PermissionPolicy#handle`, whose type must first be narrowed using methods like `isPermission` and `isResourcePermission`:

  ```typescript
  class TestPermissionPolicy implements PermissionPolicy {
    async handle(
      request: PolicyQuery<Permission>,
      _user?: BackstageIdentityResponse,
    ): Promise<PolicyDecision> {
      if (
        // Narrow type of `request.permission` to `ResourcePermission<'catalog-entity'>
        isResourcePermission(request.permission, RESOURCE_TYPE_CATALOG_ENTITY)
      ) {
        return createCatalogConditionalDecision(
          request.permission,
          catalogConditions.isEntityOwner(
            _user?.identity.ownershipEntityRefs ?? [],
          ),
        );
      }

      return {
        result: AuthorizeResult.ALLOW,
      };
  ```

  **BREAKING**: when creating `PermissionRule`s, provide a `resourceType`.

  ```diff
  export const isEntityOwner = createCatalogPermissionRule({
    name: 'IS_ENTITY_OWNER',
    description: 'Allow entities owned by the current user',
  +  resourceType: RESOURCE_TYPE_CATALOG_ENTITY,
    apply: (resource: Entity, claims: string[]) => {
      if (!resource.relations) {
        return false;
      }

      return resource.relations
        .filter(relation => relation.type === RELATION_OWNED_BY)
        .some(relation => claims.includes(relation.targetRef));
    },
    toQuery: (claims: string[]) => ({
      key: 'relations.ownedBy',
      values: claims,
    }),
  });
  ```

- c98d271466: **BREAKING:**

  - Rename `PolicyAuthorizeQuery` to `PolicyQuery`
  - Remove `PolicyDecision`, `DefinitivePolicyDecision`, and `ConditionalPolicyDecision`. These types are now exported from `@backstage/plugin-permission-common`

- 322b69e46a: **BREAKING:** `ServerPermissionClient` now implements `PermissionEvaluator`, which moves out the capabilities for evaluating conditional decisions from `authorize()` to `authorizeConditional()` method.

### Patch Changes

- 90754d4fa9: Removed [strict](https://github.com/colinhacks/zod#strict) validation from `PermissionCriteria` schemas to support backward-compatible changes.
- 8012ac46a0: Fix signature of permission rule in test suites
- Updated dependencies
  - @backstage/plugin-permission-common@0.6.0
  - @backstage/plugin-auth-node@0.2.0
  - @backstage/backend-common@0.13.2

## 0.6.0-next.2

### Minor Changes

- 322b69e46a: **BREAKING:** `ServerPermissionClient` now implements `PermissionEvaluator`, which moves out the capabilities for evaluating conditional decisions from `authorize()` to `authorizeConditional()` method.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.6.0-next.1
  - @backstage/backend-common@0.13.2-next.2

## 0.6.0-next.1

### Minor Changes

- 8012ac46a0: **BREAKING**: Stronger typing in `PermissionPolicy` 🎉.

  Previously, it was entirely the responsibility of the `PermissionPolicy` author to only return `CONDITIONAL` decisions for permissions that are associated with a resource, and to return the correct kind of `PermissionCondition` instances inside the decision. Now, the policy authoring helpers provided in this package now ensure that the decision and permission match.

  **For policy authors**: rename and adjust api of `createConditionExports`. Previously, the function returned a factory for creating conditional decisions named `createPolicyDecision`, which had a couple of drawbacks:

  1. The function always creates a _conditional_ policy decision, but this was not reflected in the name.
  2. Conditional decisions should only ever be returned from `PermissionPolicy#handle` for resource permissions, but there was nothing in the API that encoded this constraint.

  This change addresses the drawbacks above by making the following changes for policy authors:

  - The `createPolicyDecision` method has been renamed to `createConditionalDecision`.
  - Along with conditions, the method now accepts a permission, which must be a `ResourcePermission`. This is expected to be the handled permission in `PermissionPolicy#handle`, whose type must first be narrowed using methods like `isPermission` and `isResourcePermission`:

  ```typescript
  class TestPermissionPolicy implements PermissionPolicy {
    async handle(
      request: PolicyQuery<Permission>,
      _user?: BackstageIdentityResponse,
    ): Promise<PolicyDecision> {
      if (
        // Narrow type of `request.permission` to `ResourcePermission<'catalog-entity'>
        isResourcePermission(request.permission, RESOURCE_TYPE_CATALOG_ENTITY)
      ) {
        return createCatalogConditionalDecision(
          request.permission,
          catalogConditions.isEntityOwner(
            _user?.identity.ownershipEntityRefs ?? [],
          ),
        );
      }

      return {
        result: AuthorizeResult.ALLOW,
      };
  ```

  **BREAKING**: when creating `PermissionRule`s, provide a `resourceType`.

  ```diff
  export const isEntityOwner = createCatalogPermissionRule({
    name: 'IS_ENTITY_OWNER',
    description: 'Allow entities owned by the current user',
  +  resourceType: RESOURCE_TYPE_CATALOG_ENTITY,
    apply: (resource: Entity, claims: string[]) => {
      if (!resource.relations) {
        return false;
      }

      return resource.relations
        .filter(relation => relation.type === RELATION_OWNED_BY)
        .some(relation => claims.includes(relation.targetRef));
    },
    toQuery: (claims: string[]) => ({
      key: 'relations.ownedBy',
      values: claims,
    }),
  });
  ```

- c98d271466: **BREAKING:**

  - Rename `PolicyAuthorizeQuery` to `PolicyQuery`
  - Remove `PolicyDecision`, `DefinitivePolicyDecision`, and `ConditionalPolicyDecision`. These types are now exported from `@backstage/plugin-permission-common`

### Patch Changes

- 8012ac46a0: Fix signature of permission rule in test suites
- Updated dependencies
  - @backstage/plugin-permission-common@0.6.0-next.0
  - @backstage/backend-common@0.13.2-next.1

## 0.5.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.2.0-next.0
  - @backstage/backend-common@0.13.2-next.0

## 0.5.5

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.1
  - @backstage/config@1.0.0
  - @backstage/errors@1.0.0
  - @backstage/plugin-permission-common@0.5.3
  - @backstage/plugin-auth-node@0.1.6

## 0.5.4

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.0
  - @backstage/plugin-auth-node@0.1.5

## 0.5.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.0-next.0
  - @backstage/plugin-auth-node@0.1.5-next.0

## 0.5.3

### Patch Changes

- 580f4e1df8: Export some utility functions for parsing PermissionCriteria

  `isAndCriteria`, `isOrCriteria`, `isNotCriteria` are now exported.

- Updated dependencies
  - @backstage/backend-common@0.12.0
  - @backstage/plugin-permission-common@0.5.2
  - @backstage/plugin-auth-node@0.1.4

## 0.5.2

### Patch Changes

- 0816f8237a: Improved error message shown when permissions are enabled without backend-to-backend authentication.
- Updated dependencies
  - @backstage/backend-common@0.11.0
  - @backstage/plugin-auth-node@0.1.3

## 0.5.1

### Patch Changes

- Fix for the previous release with missing type declarations.
- Updated dependencies
  - @backstage/backend-common@0.10.9
  - @backstage/config@0.1.15
  - @backstage/errors@0.2.2
  - @backstage/plugin-auth-node@0.1.2
  - @backstage/plugin-permission-common@0.5.1

## 0.5.0

### Minor Changes

- 8c646beb24: **BREAKING** `PermissionCriteria` now requires at least one condition in `anyOf` and `allOf` arrays. This addresses some ambiguous behavior outlined in #9280.

### Patch Changes

- c77c5c7eb6: Added `backstage.role` to `package.json`
- Updated dependencies
  - @backstage/backend-common@0.10.8
  - @backstage/errors@0.2.1
  - @backstage/plugin-auth-node@0.1.1
  - @backstage/plugin-permission-common@0.5.0
  - @backstage/config@0.1.14

## 0.4.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.7
  - @backstage/plugin-auth-node@0.1.0

## 0.4.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-backend@0.10.0-next.0
  - @backstage/backend-common@0.10.7-next.0

## 0.4.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-backend@0.9.0
  - @backstage/backend-common@0.10.6

## 0.4.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-backend@0.9.0-next.1
  - @backstage/backend-common@0.10.6-next.0

## 0.4.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-backend@0.9.0-next.0

## 0.4.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-backend@0.8.0
  - @backstage/backend-common@0.10.5

## 0.4.0

### Minor Changes

- 0ae4f4cc82: **BREAKING**: `PolicyAuthorizeRequest` type has been renamed to `PolicyAuthorizeQuery`.
  **BREAKING**: Update to use renamed request and response types from @backstage/plugin-permission-common.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-backend@0.7.0
  - @backstage/plugin-permission-common@0.4.0
  - @backstage/backend-common@0.10.4
  - @backstage/config@0.1.13

## 0.4.0-next.0

### Minor Changes

- 0ae4f4cc82: **BREAKING**: `PolicyAuthorizeRequest` type has been renamed to `PolicyAuthorizeQuery`.
  **BREAKING**: Update to use renamed request and response types from @backstage/plugin-permission-common.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-backend@0.7.0-next.0
  - @backstage/plugin-permission-common@0.4.0-next.0
  - @backstage/backend-common@0.10.4-next.0
  - @backstage/config@0.1.13-next.0

## 0.3.0

### Minor Changes

- 419ca637c0: Optimizations to the integration between the permission backend and plugin-backends using createPermissionIntegrationRouter:

  - The permission backend already supported batched requests to authorize, but would make calls to plugin backend to apply conditions serially. Now, after applying the policy for each authorization request, the permission backend makes a single batched /apply-conditions request to each plugin backend referenced in policy decisions.
  - The `getResource` method accepted by `createPermissionIntegrationRouter` has been replaced with `getResources`, to allow consumers to make batch requests to upstream data stores. When /apply-conditions is called with a batch of requests, all required resources are requested in a single invocation of `getResources`.

  Plugin owners consuming `createPermissionIntegrationRouter` should replace the `getResource` method in the options with a `getResources` method, accepting an array of resourceRefs, and returning an array of the corresponding resources.

### Patch Changes

- 9db1b86f32: Add helpers for creating PermissionRules with inferred types
- Updated dependencies
  - @backstage/config@0.1.12
  - @backstage/backend-common@0.10.3
  - @backstage/plugin-auth-backend@0.6.2
  - @backstage/errors@0.2.0
  - @backstage/plugin-permission-common@0.3.1

## 0.2.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-backend@0.6.0
  - @backstage/backend-common@0.10.1

## 0.2.2

### Patch Changes

- 2f8a9b665f: Add `ServerPermissionClient`, which implements `PermissionAuthorizer` from @backstage/plugin-permission-common. This implementation skips authorization entirely when the supplied token is a valid backend-to-backend token, thereby allowing backend-to-backend systems to communicate without authorization.

  The `ServerPermissionClient` should always be used over the standard `PermissionClient` in plugin backends.

- Updated dependencies
  - @backstage/backend-common@0.10.0
  - @backstage/plugin-auth-backend@0.5.2
  - @backstage/plugin-permission-common@0.3.0

## 0.2.1

### Patch Changes

- dcd1a0c3f4: Minor improvement to the API reports, by not unpacking arguments directly
- a036b65c2f: Updated to use the new `BackstageIdentityResponse` type from `@backstage/plugin-auth-backend`.

  The `BackstageIdentityResponse` type is backwards compatible with the `BackstageIdentity`, and provides an additional `identity` field with the claims of the user.

- Updated dependencies
  - @backstage/plugin-auth-backend@0.5.0

## 0.2.0

### Minor Changes

- e7851efa9e: Rename and adjust permission policy return type to reduce nesting
- 450ca92330: Change route used for integration between the authorization framework and other plugin backends to use the /.well-known prefix.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-backend@0.4.10

## 0.1.0

### Minor Changes

- 44b46644d9: New package containing common permission and authorization utilities for backend plugins. For more information, see the [authorization PRFC](https://github.com/backstage/backstage/pull/7761).

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-backend@0.4.9
  - @backstage/plugin-permission-common@0.2.0
