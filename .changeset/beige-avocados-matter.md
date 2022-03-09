---
'@backstage/plugin-catalog-backend': patch
---

Replace `createCatalogPolicyDecision` export with `createCatalogConditionalDecision`, which accepts a permission parameter of type `ResourcePermission<'catalog-entity'>` along with conditions. The permission passed is expected to be the handled permission in `PermissionPolicy#handle`, whose type must first be narrowed using methods like `isPermission` and `isResourcePermission`:

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
