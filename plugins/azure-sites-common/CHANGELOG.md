# @backstage/plugin-azure-sites-common

## 0.1.2-next.0

### Patch Changes

- 5a409bb: Azure Sites `start` and `stop` action is now protected with the Permissions framework.

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

- Updated dependencies
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/plugin-catalog-common@1.0.21-next.0
  - @backstage/plugin-permission-common@0.7.12

## 0.1.1

### Patch Changes

- 406b786a2a2c: Mark package as being free of side effects, allowing more optimized Webpack builds.

## 0.1.1-next.0

### Patch Changes

- 406b786a2a2c: Mark package as being free of side effects, allowing more optimized Webpack builds.

## 0.1.0

### Minor Changes

- 4a75ce761c: Azure Sites (Apps & Functions) support for a given entity. View the current status of the site, quickly jump to site's Overview page, or Log Stream page.

## 0.1.0-next.0

### Minor Changes

- 4a75ce761c: Azure Sites (Apps & Functions) support for a given entity. View the current status of the site, quickly jump to site's Overview page, or Log Stream page.
