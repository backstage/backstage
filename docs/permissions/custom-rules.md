---
id: custom-rules
title: Defining custom permission rules
description: How to define custom permission rules for existing resources
---

For some use cases, you may want to define custom [rules](./concepts.md#resources-and-rules) in addition to the ones provided by a plugin. In the [previous section](./writing-a-policy.md) we used the `isEntityOwner` rule to control access for catalog entities. Let's extend this policy with a custom rule that checks what [system](https://backstage.io/docs/features/software-catalog/system-model#system) an entity is part of.

## Define a custom rule

Plugins should export a rule factory that provides type-safety that ensures compatibility with the plugin's backend. The catalog plugin exports `createCatalogPermissionRule` from `@backstage/plugin-catalog-backend/alpha` for this purpose. Note: the `/alpha` path segment is temporary until this API is marked as stable. For this example, we'll define the rule in `packages/backend/src/plugins/permission.ts`, but you can put it anywhere that's accessible by your `backend` package.

```typescript
import type { Entity } from '@backstage/plugin-catalog-model';
import { createCatalogPermissionRule } from '@backstage/plugin-catalog-backend/alpha';
import { createConditionFactory } from '@backstage/plugin-permission-node';

export const isInSystemRule = createCatalogPermissionRule({
  name: 'IS_IN_SYSTEM',
  description: 'Checks if an entity is part of the system provided',
  resourceType: 'catalog-entity',
  apply: (resource: Entity, systemRef: string) => {
    if (!resource.relations) {
      return false;
    }

    return resource.relations
      .filter(relation => relation.type === 'partOf')
      .some(relation => relation.targetRef === systemRef);
  },
  toQuery: (systemRef: string) => ({
    key: 'relations.partOf',
    value: systemRef,
  }),
});

const isInSystem = createConditionFactory(isInSystemRule);
```

For a more detailed explanation on defining rules, refer to the [documentation for plugin authors](./plugin-authors/03-adding-a-resource-permission-check.md#adding-support-for-conditional-decisions).

## Provide the rule during plugin setup

Now that we have a custom rule defined, we need provide it to the catalog plugin. This step is important because the catalog plugin will use the rule's `toQuery` and `apply` methods while evaluating conditional authorize results. There's no guarantee that the catalog and permission backends are running on the same server, so we must explicitly link the rule to ensure that it's available at runtime.

The api for providing custom rules may differ between plugins, but there should typically be some integration point during the creation of the backend router. For the catalog, this integration point is exposed via `CatalogBuilder.addPermissionRules`.

```typescript
// packages/backend/src/plugins/catalog.ts

import { isInSystemRule } from './permission';

...

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const builder = await CatalogBuilder.create(env);
  builder.addPermissionRules(isInSystem);
  ...
  return router;
}
```

The new rule is now ready for use in a permission policy!

## Use the rule in a policy

Let's bring this all together by extending the example policy from the previous section.

```diff
// packages/backend/src/plugins/permission.ts

+ import { isInSystem } from './catalog';

...

class TestPermissionPolicy implements PermissionPolicy {
  async handle(
    request: PolicyQuery,
    user?: BackstageIdentityResponse,
  ): Promise<PolicyDecision> {
    if (isResourcePermission(request.permission, 'catalog-entity')) {
      return createCatalogConditionalDecision(
        request.permission,
-       catalogConditions.isEntityOwner(
-         user?.identity.ownershipEntityRefs ?? [],
-       ),
+       {
+         anyOf: [
+           catalogConditions.isEntityOwner(
+             user?.identity.ownershipEntityRefs ?? []
+           ),
+           isInSystem('interviewing')
+         ]
+       }
      );
    }

    return { result: AuthorizeResult.ALLOW };
  }
```

The updated policy will allow catalog entity resource permissions if any of the following are true:

- User owns the target entity
- Target entity is part of the `'interviewing'` system
