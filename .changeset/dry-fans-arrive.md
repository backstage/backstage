---
'@backstage/plugin-permission-node': minor
---

**BREAKING**: Stronger typing in `PermissionPolicy` 🎉.

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
