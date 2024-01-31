---
id: custom-rules
title: Defining custom permission rules
description: How to define custom permission rules for existing resources
---

For some use cases, you may want to define custom [rules](../references/glossary.md#rule-permission-plugin) in addition to the ones provided by a plugin. In the [previous section](./writing-a-policy.md) we used the `isEntityOwner` rule to control access for catalog entities. Let's extend this policy with a custom rule that checks what [system](https://backstage.io/docs/features/software-catalog/system-model#system) an entity is part of.

## Define a custom rule

Plugins should export a rule factory that provides type-safety that ensures compatibility with the plugin's backend. The catalog plugin exports `createCatalogPermissionRule` from `@backstage/plugin-catalog-backend/alpha` for this purpose. Note: the `/alpha` path segment is temporary until this API is marked as stable. For this example, we'll define the rule and create a condition in `packages/backend/src/plugins/permission.ts`.

We use Zod in our example below. To install, run:

```bash
yarn workspace backend add zod
```

```typescript title="packages/backend/src/plugins/permission.ts"
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

Still in the `packages/backend/src/plugins/permission.ts` file, let's use the condition we just created in our `TestPermissionPolicy`.

```ts title="packages/backend/src/plugins/permission.ts"
...
/* highlight-remove-next-line */
import { createCatalogPermissionRule } from '@backstage/plugin-catalog-backend/alpha';
/* highlight-add-next-line */
import { catalogConditions, createCatalogConditionalDecision, createCatalogPermissionRule } from '@backstage/plugin-catalog-backend/alpha';
/* highlight-remove-next-line */
import { createConditionFactory } from '@backstage/plugin-permission-node';
/* highlight-add-next-line */
import { PermissionPolicy, PolicyQuery, createConditionFactory } from '@backstage/plugin-permission-node';
/* highlight-add-start */
import { BackstageIdentityResponse } from '@backstage/plugin-auth-node';
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

class TestPermissionPolicy implements PermissionPolicy {
  async handle(
    request: PolicyQuery,
    user?: BackstageIdentityResponse,
  ): Promise<PolicyDecision> {
    if (isResourcePermission(request.permission, 'catalog-entity')) {
      return createCatalogConditionalDecision(
        request.permission,
        /* highlight-remove-start */
        catalogConditions.isEntityOwner({
          claims: user?.identity.ownershipEntityRefs ?? [],
        }),
        /* highlight-remove-end */
        /* highlight-add-start */
        {
          anyOf: [
            catalogConditions.isEntityOwner({
              claims: user?.identity.ownershipEntityRefs ?? [],
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

The api for providing custom rules may differ between plugins, but there should typically be some integration point during the creation of the backend router. For the catalog, this integration point is exposed via `CatalogBuilder.addPermissionRules`.

```typescript title="packages/backend/src/plugins/catalog.ts"
import { CatalogBuilder } from '@backstage/plugin-catalog-backend';
/* highlight-add-next-line */
import { isInSystemRule } from './permission';

...

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const builder = await CatalogBuilder.create(env);
  /* highlight-add-next-line */
  builder.addPermissionRules(isInSystemRule);
  ...
  return router;
}
```

The updated policy will allow catalog entity resource permissions if any of the following are true:

- User owns the target entity
- Target entity is part of the 'interviewing' system
