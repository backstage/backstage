# @backstage/plugin-permission-backend

## 0.3.0

### Minor Changes

- 419ca637c0: Optimizations to the integration between the permission backend and plugin-backends using createPermissionIntegrationRouter:

  - The permission backend already supported batched requests to authorize, but would make calls to plugin backend to apply conditions serially. Now, after applying the policy for each authorization request, the permission backend makes a single batched /apply-conditions request to each plugin backend referenced in policy decisions.
  - The `getResource` method accepted by `createPermissionIntegrationRouter` has been replaced with `getResources`, to allow consumers to make batch requests to upstream data stores. When /apply-conditions is called with a batch of requests, all required resources are requested in a single invocation of `getResources`.

  Plugin owners consuming `createPermissionIntegrationRouter` should replace the `getResource` method in the options with a `getResources` method, accepting an array of resourceRefs, and returning an array of the corresponding resources.

### Patch Changes

- Updated dependencies
  - @backstage/config@0.1.12
  - @backstage/backend-common@0.10.3
  - @backstage/plugin-permission-node@0.3.0
  - @backstage/plugin-auth-backend@0.6.2
  - @backstage/errors@0.2.0
  - @backstage/plugin-permission-common@0.3.1

## 0.2.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-backend@0.6.0
  - @backstage/backend-common@0.10.1
  - @backstage/plugin-permission-node@0.2.3

## 0.2.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.0
  - @backstage/plugin-auth-backend@0.5.2
  - @backstage/plugin-permission-common@0.3.0
  - @backstage/plugin-permission-node@0.2.2

## 0.2.1

### Patch Changes

- a036b65c2f: Updated to use the new `BackstageIdentityResponse` type from `@backstage/plugin-auth-backend`.

  The `BackstageIdentityResponse` type is backwards compatible with the `BackstageIdentity`, and provides an additional `identity` field with the claims of the user.

- Updated dependencies
  - @backstage/plugin-auth-backend@0.5.0
  - @backstage/backend-common@0.9.13
  - @backstage/plugin-permission-node@0.2.1

## 0.2.0

### Minor Changes

- 450ca92330: Change route used for integration between the authorization framework and other plugin backends to use the /.well-known prefix.

### Patch Changes

- e7851efa9e: Rename and adjust permission policy return type to reduce nesting
- Updated dependencies
  - @backstage/plugin-auth-backend@0.4.10
  - @backstage/plugin-permission-node@0.2.0
  - @backstage/backend-common@0.9.12

## 0.1.0

### Minor Changes

- 7a8312f126: New package containing the backend for authorization and permissions. For more information, see the [authorization PRFC](https://github.com/backstage/backstage/pull/7761).

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-backend@0.4.9
  - @backstage/plugin-permission-node@0.1.0
  - @backstage/backend-common@0.9.11
  - @backstage/plugin-permission-common@0.2.0
