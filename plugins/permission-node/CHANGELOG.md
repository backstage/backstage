# @backstage/plugin-permission-node

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
