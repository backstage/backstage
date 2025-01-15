---
id: custom-rules
title: Defining custom permission rules
description: How to define custom permission rules for existing resources
---

:::info
This documentation is written for [the new backend system](../backend-system/index.md) which is the default since Backstage [version 1.24](../releases/v1.24.0.md). If you are still on the old backend system, you may want to read [its own article](./custom-rules--old.md) instead, and [consider migrating](../backend-system/building-backends/08-migrating.md)!
:::

For some use cases, you may want to define custom [rules](../references/glossary.md#rule-permission-plugin) in addition to the ones provided by a plugin. In the [previous section](./writing-a-policy.md) we used the `isEntityOwner` rule to control access for catalog entities. Let's extend this policy with a custom rule that checks what [system](https://backstage.io/docs/features/software-catalog/system-model#system) an entity is part of.

## Define a custom rule

Plugins should export a rule factory that provides type-safety that ensures compatibility with the plugin's backend. The catalog plugin exports `createCatalogPermissionRule` from `@backstage/plugin-catalog-backend/alpha` for this purpose. Note: the `/alpha` path segment is temporary until this API is marked as stable. For this example, we'll define the rule and create a condition in `packages/backend/src/extensions/permissionsPolicyExtension.ts`.

We use `zod` and `@backstage/catalog-model` in our example below. To install them run:

```bash title="from your Backstage root directory"
yarn --cwd packages/backend add zod @backstage/catalog-model
```

```ts title="packages/backend/src/extensions/permissionsPolicyExtension.ts"
...

import type { Entity } from '@backstage/catalog-model';
import { createCatalogPermissionRule } from '@backstage/plugin-catalog-backend/alpha';
import { createConditionFactory } from '@backstage/plugin-permission-node';
import { z } from 'zod';

export const isInSystemRule = createCatalogPermissionRule({
  name: 'IS_IN_SYSTEM',
  description: 'Checks if an entity is part of the system provided',
  resourceType: 'catalog-entity',
  paramsSchema: z.object({
    systemRef: z
      .string()
      .describe('SystemRef to check the resource is part of'),
  }),
  apply: (resource: Entity, { systemRef }) => {
    if (!resource.relations) {
      return false;
    }

    return resource.relations
      .filter(relation => relation.type === 'partOf')
      .some(relation => relation.targetRef === systemRef);
  },
  toQuery: ({ systemRef }) => ({
    key: 'relations.partOf',
    values: [systemRef],
  }),
});

const isInSystem = createConditionFactory(isInSystemRule);

...
```

For a more detailed explanation on defining rules, refer to the [documentation for plugin authors](./plugin-authors/03-adding-a-resource-permission-check.md#adding-support-for-conditional-decisions).

Still in the `packages/backend/src/extensions/permissionsPolicyExtension.ts` file, let's use the condition we just created in our `CustomPermissionPolicy`.

```ts title="packages/backend/src/extensions/permissionsPolicyExtension.ts"
...
/* highlight-remove-next-line */
import { createCatalogPermissionRule } from '@backstage/plugin-catalog-backend/alpha';
/* highlight-add-next-line */
import { catalogConditions, createCatalogConditionalDecision, createCatalogPermissionRule } from '@backstage/plugin-catalog-backend/alpha';
/* highlight-remove-next-line */
import { createConditionFactory } from '@backstage/plugin-permission-node';
/* highlight-add-next-line */
import { PermissionPolicy, PolicyQuery, PolicyQueryUser, createConditionFactory } from '@backstage/plugin-permission-node';
/* highlight-add-start */
import { AuthorizeResult, PolicyDecision, isResourcePermission } from '@backstage/plugin-permission-common';
/* highlight-add-end */
...

export const isInSystemRule = createCatalogPermissionRule({
  name: 'IS_IN_SYSTEM',
  description: 'Checks if an entity is part of the system provided',
  resourceType: 'catalog-entity',
  paramsSchema: z.object({
    systemRef: z
      .string()
      .describe('SystemRef to check the resource is part of'),
  }),
  apply: (resource: Entity, { systemRef }) => {
    if (!resource.relations) {
      return false;
    }

    return resource.relations
      .filter(relation => relation.type === 'partOf')
      .some(relation => relation.targetRef === systemRef);
  },
  toQuery: ({ systemRef }) => ({
    key: 'relations.partOf',
    values: [systemRef],
  }),
});

const isInSystem = createConditionFactory(isInSystemRule);

class CustomPermissionPolicy implements PermissionPolicy {
  async handle(
    request: PolicyQuery,
    user?: PolicyQueryUser,
  ): Promise<PolicyDecision> {
    if (isResourcePermission(request.permission, 'catalog-entity')) {
      return createCatalogConditionalDecision(
        request.permission,
        /* highlight-remove-start */
        catalogConditions.isEntityOwner({
          claims: user?.info.ownershipEntityRefs ?? [],
        }),
        /* highlight-remove-end */
        /* highlight-add-start */
        {
          anyOf: [
            catalogConditions.isEntityOwner({
              claims: user?.info.ownershipEntityRefs ?? [],
            }),
            isInSystem({ systemRef: 'interviewing' }),
          ],
        },
        /* highlight-add-end */
      );
    }

    return { result: AuthorizeResult.ALLOW };
  }
}

...
```

## Provide the rule during plugin setup

Now that we have a custom rule defined and added to our policy, we need provide it to the catalog plugin. This step is important because the catalog plugin will use the rule's `toQuery` and `apply` methods while evaluating conditional authorize results. There's no guarantee that the catalog and permission backends are running on the same server, so we must explicitly link the rule to ensure that it's available at runtime.

:::warning Warning

The `PermissionsRegistryService` is a fairly new addition and not yet supported by all plugins as they might still be using the old `createPermissionIntegrationRouter` that cannot be extended. If you encounter errors when installing custom rules for a plugin, the plugin may need to be switched to using the `PermissionsRegistryService` first.

:::

To install custom rules in a plugin, we need to use the [`PermissionsRegistryService`](../backend-system/core-services/permissionsRegistry.md). Here's the steps you'll need to take to add the `isInSystemRule` we created above to the catalog:

1. We will be using the `@backstage/plugin-catalog-node` package as it contains the extension point we need. Run this to add it:

   ```bash title="from your Backstage root directory"
   yarn --cwd packages/backend add @backstage/plugin-catalog-node
   ```

2. Next create a `catalogPermissionRules.ts` file in the `packages/backend/src/modules` folder.
3. Then add this as the contents of the new `catalogPermissionRules.ts` file:

   ```typescript title="packages/backend/src/modules/catalogPermissionRules.ts"
   import { createBackendModule } from '@backstage/backend-plugin-api';
   import { catalogPermissionExtensionPoint } from '@backstage/plugin-catalog-node/alpha';
   import { isInSystemRule } from './permissionPolicyExtension';

   export default createBackendModule({
     pluginId: 'catalog',
     moduleId: 'permission-rules',
     register(reg) {
       reg.registerInit({
         deps: { permissionsRegistry: coreServices.permissionsRegistry },
         async init({ permissionsRegistry }) {
           permissionsRegistry.addPermissionRules([isInSystemRule]);
         },
       });
     },
   });
   ```

4. Next we need to add this to the backend by adding the following line:

   ```ts title="packages/backend/src/index.ts"
   // catalog plugin
   backend.add(import('@backstage/plugin-catalog-backend'));
   backend.add(
     import('@backstage/plugin-catalog-backend-module-scaffolder-entity-model'),
   );
   /* highlight-add-next-line */
   backend.add(import('./extensions/catalogPermissionRules'));
   ```

5. Now when you run you Backstage instance - `yarn dev` - the rule will be added to the catalog plugin.

The updated policy will allow catalog entity resource permissions if any of the following are true:

- User owns the target entity
- Target entity is part of the 'interviewing' system
