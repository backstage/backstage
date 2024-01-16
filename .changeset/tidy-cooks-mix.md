---
'@backstage/plugin-azure-sites-backend': minor
'@backstage/plugin-azure-sites-common': minor
'@backstage/plugin-azure-sites': minor
---

`Azure Site` Start and Stop action is now protected with `Permission framework`. Also `catalogApi` is required in `createRouter` when adding this plugin.

The below example illustrate that the action is forbids anyone but the owner of the catalog entity to trigger actions towards a site tied to an entity.

```typescript
   // packages/backend/src/plugins/permission.ts
  import { azureSitesActionPermission } from '@backstage/plugin-azure-sites-common';
   ...
   class TestPermissionPolicy implements PermissionPolicy {
  async handle(request: PolicyQuery, user?: BackstageIdentityResponse): Promise<PolicyDecision> {
     if (isPermission(request.permission, azureSitesActionPermission)) {
       return createCatalogConditionalDecision(
         request.permission,
         catalogConditions.isEntityOwner({
           claims: user?.identity.ownershipEntityRefs ??  [],
         }),
       );
     }
     ...
     return {
       result: AuthorizeResult.ALLOW,
     };
   }
   ...
   }
```
