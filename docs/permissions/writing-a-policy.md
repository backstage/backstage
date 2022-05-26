---
id: writing-a-policy
title: Writing a permission policy
description: How to write your own permission policy as a Backstage integrator
---

In the [previous section](./getting-started.md), we were able to set up the permission framework and make a simple change to our `TestPermissionPolicy` to confirm that policy is indeed wired up correctly.

That policy looked like this:

```typescript
// packages/backend/src/plugins/permission.ts

class TestPermissionPolicy implements PermissionPolicy {
  async handle(request: PolicyQuery): Promise<PolicyDecision> {
    if (request.permission.name === 'catalog.entity.delete') {
      return {
        result: AuthorizeResult.DENY,
      };
    }

    return { result: AuthorizeResult.ALLOW };
  }
}
```

## What's in a policy?

Let's break this down a bit further. The request object of type [PolicyQuery](https://backstage.io/docs/reference/plugin-permission-node.policyquery) is a simple wrapper around [the Permission object](https://backstage.io/docs/reference/plugin-permission-common.permission). This permission object encapsulates information about the action that the user is attempting to perform (See [the Concepts page](./concepts.md) for more details).

In the policy above, we are checking to see if the provided action is a catalog entity delete action, which is the permission that the catalog plugin authors have created to represent the action of unregistering a catalog entity. If this is the case, we return a [Definitive Policy Decision](https://backstage.io/docs/reference/plugin-permission-common.definitivepolicydecision) of DENY. In all other cases, we return ALLOW (resulting in an allow-by-default behavior).

As we confirmed in the previous section, we know that this now prevents us from unregistering catalog components. Hooray! But you may notice that this prevents _anyone_ from unregistering a component, which is not a very realistic policy. Let's improve this policy by disabling the unregister action _unless you are the owner of this component_.

## Conditional decisions

Let's change the policy to the following:

```diff
- import { IdentityClient } from '@backstage/plugin-auth-node';
+ import {
+   BackstageIdentityResponse,
+   IdentityClient
+ } from '@backstage/plugin-auth-node';
  import {
  AuthorizeResult,
  PolicyDecision,
+ isPermission,
} from '@backstage/plugin-permission-common';
+ import {
+   catalogConditions,
+   createCatalogConditionalDecision,
+ } from '@backstage/plugin-catalog-backend/alpha';
+ import {
+   catalogEntityDeletePermission,
+ } from '@backstage/plugin-catalog-common/alpha';

  ...

  class TestPermissionPolicy implements PermissionPolicy {
-   async handle(request: PolicyQuery): Promise<PolicyDecision> {
+   async handle(
+     request: PolicyQuery,
+     user?: BackstageIdentityResponse,
+    ): Promise<PolicyDecision> {
-     if (request.permission.name === 'catalog.entity.delete') {
+     if (isPermission(request.permission, catalogEntityDeletePermission)) {
-       return {
-         result: AuthorizeResult.DENY,
-       };
+       return createCatalogConditionalDecision(
+         request.permission,
+         catalogConditions.isEntityOwner(
+           user?.identity.ownershipEntityRefs ?? [],
+         ),
+       );
      }

      return { result: AuthorizeResult.ALLOW };
    }
  }
```

Let's walk through the new code that we just added.

Instead of returning an Definitive Policy Decision, we use factory methods to construct a [Conditional Policy Decision](https://backstage.io/docs/reference/plugin-permission-common.conditionalpolicydecision) (See the [Concepts page](./concepts.md) for more details). Since the policy doesn't have enough information to determine if `user` is the entity owner, this criteria is encapsulated within the conditional decision. However, `createCatalogConditionalDecision` will not compile unless `request.permission` is a catalog entity [`ResourcePermission`](https://backstage.io/docs/reference/plugin-permission-common.resourcepermission). This type constraint ensures that policies return conditional decisions that are compatible with the requested permission. To address this, we use [`isPermission`](https://backstage.io/docs/reference/plugin-permission-common.ispermission) to ["narrow"](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) the type of `request.permission` to `ResourcePermission<'catalog-entity'>`. This matches the runtime behavior that was in place before, but you'll notice that the type of `request.permission` has changed within the scope of that `if` statement.

The `catalogConditions` object contains all of the rules defined by the catalog plugin. These rules can be combined to form a [`PermissionCriteria`](https://backstage.io/docs/reference/plugin-permission-common.permissioncriteria) object, but for this case we only need to use the `isEntityOwner` rule. This rule accepts a list of entity refs that represent User identity and Group membership used to determine ownership. The second argument to `PermissionPolicy#handle` provides us with a `BackstageIdentityResponse` object, from which we can grab the user's `ownershipEntityRefs`. We provide an empty array as a fallback since the user may be anonymous.

You should now be able to see in your Backstage app that the unregister entity button is enabled for entities that you own, but disabled for all other entities!

## Resource types

Now let's say we want to prevent all actions on catalog entities unless performed by the owner. One way to achieve this may be to simply update the `if` statement and check for each permission. If you choose to write your policy this way, it will certainly work! However, it may be difficult to maintain as the policy grows, and it may not be obvious if certain permissions are left out. We can author this same policy in a more scalable way by checking the resource type of the requested permission.

```diff
import {
  AuthorizeResult,
  PolicyDecision,
- isPermission,
+ isResourcePermission,
} from '@backstage/plugin-permission-common';
 import {
   catalogConditions,
   createCatalogConditionalDecision,
 } from '@backstage/plugin-catalog-backend/alpha';
- import {
-   catalogEntityDeletePermission,
- } from '@backstage/plugin-catalog-common/alpha';

...

class TestPermissionPolicy implements PermissionPolicy {
  async handle(
    request: PolicyQuery,
    user?: BackstageIdentityResponse,
  ): Promise<PolicyDecision> {
-   if (isPermission(request.permission, catalogEntityDeletePermission)) {
+   if (isResourcePermission(request.permission, 'catalog-entity')) {
      return createCatalogConditionalDecision(
        request.permission,
        catalogConditions.isEntityOwner(
          user?.identity.ownershipEntityRefs ?? [],
        ),
      );
    }

    return { result: AuthorizeResult.ALLOW };
  }
```

In this example, we use [`isResourcePermission`](https://backstage.io/docs/reference/plugin-permission-common.isresourcepermission) to match all permissions with a resource type of `catalog-entity`. Just like `isPermission`, this helper will "narrow" the type of `request.permission` and enable the use of `createCatalogConditionalDecision`. In addition to the behavior you observed before, you should also see that catalog entities are no longer visible unless you are the owner - success!

_Note:_ Some catalog permissions do not have the `'catalog-entity'` resource type, such as [`catalogEntityCreatePermission`](https://github.com/backstage/backstage/blob/1e5e9fb9de9856a49e60fc70c38a4e4e94c69570/plugins/catalog-common/src/permissions.ts#L49). In those cases, a definitive decision is required because conditions can't be applied to an entity that does not exist yet.
