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

Let's break this down a bit further. The request object of type [PolicyQuery](https://backstage.io/docs/reference/plugin-permission-node.policyquery) is a simple wrapper around [the Permission object](https://backstage.io/docs/reference/plugin-permission-common.permission). This permission object encapsulates information about the action that the user is attemping to perform (See [the Concepts page](./concepts.md) for more details).

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
+ isResourcePermission,
} from '@backstage/plugin-permission-common';
+ import {
+   catalogConditions,
+   createCatalogConditionalDecision,
+ } from '@backstage/plugin-catalog-backend';

  ...

  class TestPermissionPolicy implements PermissionPolicy {
-   async handle(request: PolicyQuery): Promise<PolicyDecision> {
+   async handle(
+     request: PolicyQuery,
+     user?: BackstageIdentityResponse,
+    ): Promise<PolicyDecision> {
+     if (isResourcePermission(request.permission, 'catalog-entity')) {
        if (request.permission.name === 'catalog.entity.delete') {
-         return {
-           result: AuthorizeResult.DENY,
-         };
+         return createCatalogConditionalDecision(
+           request.permission,
+           catalogConditions.isEntityOwner(
+             user?.identity.ownershipEntityRefs ?? [],
+           ),
+         );
        }
+     }

      return { result: AuthorizeResult.ALLOW };
    }
  }
```

Let's walk through the new code that we just added. Inside of the if statement, instead of returning a Definitive Policy Decision of DENY, we now return a [Conditional Policy Decision](https://backstage.io/docs/reference/plugin-permission-common.conditionalpolicydecision) (See the [Concepts page](./concepts.md) for more details). This is a way for policies to defer the evaluation of the decision back to the plugin which owns the permission. This allows the framework to support cases in which the policy does not have all the information required to make a decision.

In the policy above, there's no way for the handle method to determine whether the user who is trying to unregister the entity is the owner of that entity. So we use the `createCatalogConditionalDecision` helper provided by the catalog backend to craft a conditional decision, which allows us to tell the catalog backend that it should only return ALLOW if the user owns the entity. Keep in mind that, in order to return a Conditional Policy Decision, the permission needs to be of type [ResourcePermission](https://backstage.io/docs/reference/plugin-permission-common.resourcepermission): the [isResourcePermission](https://backstage.io/docs/reference/plugin-permission-common.isresourcepermission) method guarantees the correct type in the scope of the condition.

The `catalogConditions` object contains various conditions that the catalog plug authors have provided for us to use in authoring our policy. Thankfully, they have provided the `isEntityOwner` rule, which is exactly what we need.

The `isEntityOwner` rule needs a list of claims as a parameter, and the second argument to our `handle` method provides us with a `BackstageIdentityResponse` object, from which we can grab the user's `ownershipEntityRefs`. We provide an empty array as a fallback since the user may be anonymous.

You should now be able to see in your Backstage app that the unregister entity button is enabled for entities that you own, but disabled for all other entities!

### Custom conditions

In addition to the conditions provided by the catalog plugin, you can write your own conditions for the catalog (or for any plugin that implements permissions, for that matter). This is done by using the [`createConditionFactory` helper](https://backstage.io/docs/reference/plugin-permission-node.createconditionfactory) provided by the `@backstage/plugin-permission-node` package.

## Resource types

Now let's say we would also like to restrict users from viewing catalog entities that they do not own, just like we did for unregistering entities. One way to achieve this may be to simply duplicate our if statement and check for the `catalog.entity.read` permission:

```diff
  async handle(
    request: PolicyQuery,
    user?: BackstageIdentityResponse,
  ): Promise<PolicyDecision> {
    if (isResourcePermission(request.permission, 'catalog-entity')) {
      if (request.permission.name === 'catalog.entity-delete') {
        return createCatalogConditionalDecision(
          request.permission,
          catalogConditions.isEntityOwner(
            user?.identity.ownershipEntityRefs ?? [],
          ),
        );
      }

+     if (request.permission.name === 'catalog.entity.read') {
+       return createCatalogConditionalDecision(
+         request.permission,
+         catalogConditions.isEntityOwner(
+           user?.identity.ownershipEntityRefs ?? [],
+         ),
+       );
+     }
    }
    return { result: AuthorizeResult.ALLOW };
  }
```

If you choose to write your policy this way, it will certainly work! You should be able to verify this by saving this policy and seeing that the catalog now only shows the entities that you own. However, you can imagine that as policies grow to handle many different permissions, these conditionals can quickly become repetitive. We can author this same policy in a more scalable way by using permission attributes.

```diff
  async handle(
    request: PolicyQuery,
    user?: BackstageIdentityResponse,
  ): Promise<PolicyDecision> {
    if (isResourcePermission(request.permission, 'catalog-entity')) {
-     if (request.permission.name === 'catalog.entity-delete') {
+     if (
+       request.permission.attributes.action === 'delete' ||
+       request.permission.attributes.action === 'read'
+     ) {
        return createCatalogConditionalDecision(
          request.permission,
          catalogConditions.isEntityOwner(
            user?.identity.ownershipEntityRefs ?? [],
          ),
        );
      }

-     if (request.permission.name === 'catalog.entity.read') {
-       return createCatalogConditionalDecision(
-         request.permission,
-         catalogConditions.isEntityOwner(
-           user?.identity.ownershipEntityRefs ?? [],
-         ),
-       );
-     }
    }
    return { result: AuthorizeResult.ALLOW };
  }
```

In this example, we use the `action` permission attribute to catch all authorization requests that have to do with `read` and `delete` permissions. Now, you should be able to see the same functionality as before (only see the catalog entities that you own) - success!

_Note:_ Notice that while the `catalogEntityDeletePermission` and the `catalogEntityReadPermission` used here have the `'catalog-entity'` resource type, the [`catalogEntityCreatePermission`](https://github.com/backstage/backstage/blob/1e5e9fb9de9856a49e60fc70c38a4e4e94c69570/plugins/catalog-common/src/permissions.ts#L49) does not have a resource type associated with it, as it does not make sense to apply conditions to an entity that has not yet been created.

## Conclusion

Through a combination of permissions and conditions, you should be able to author a policy that works for your instance of Backstage and your organzation. As the ecosystem around permissions in Backstage become more mature, you may be able to choose from other authorization packages instead of writing your own policy. If you're interested in more detailed descriptions of the concepts that comprise the permission framework, check out the [Concepts page](./concepts.md).
