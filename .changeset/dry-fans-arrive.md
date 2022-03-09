---
'@backstage/plugin-permission-node': minor
---

**BREAKING**: Rename and adjust api of `createConditionExports`. Previously, the function returned a factory for creating conditional decisions named `createPolicyDecision`, which had a couple of drawbacks:

1. The function always creates a _conditional_ policy decision, but this was not reflected in the name.
2. Conditional decisions should only ever be returned from `PermissionPolicy#handle` for resource permissions, but there was nothing in the API that encoded this constraint.

This change addresses the drawbacks above by making the following changes:

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
