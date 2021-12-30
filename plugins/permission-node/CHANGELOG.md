# @backstage/plugin-permission-node

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
