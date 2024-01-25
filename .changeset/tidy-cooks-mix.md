---
'@backstage/plugin-azure-sites-backend': patch
'@backstage/plugin-azure-sites-common': patch
'@backstage/plugin-azure-sites': patch
---

Azure Sites `start` and `stop` action is now protected with the Permissions framework.

The below example describes an action that forbids anyone but the owner of the catalog entity to trigger actions towards a site tied to an entity.

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
