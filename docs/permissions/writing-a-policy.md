---
id: writing-a-policy
title: Writing a permission policy
description: How to write your own permission policy as a Backstage integrator
---

In the [previous section](./getting-started.md), we used `yarn new` to scaffold a permission policy module and confirmed that the policy is wired up correctly.

The generated policy class looks like this:

```ts
export class CustomPolicy implements PermissionPolicy {
  async handle(
    _request: PolicyQuery,
    _user?: PolicyQueryUser,
  ): Promise<PolicyDecision> {
    return { result: AuthorizeResult.ALLOW };
  }
}
```

That is a very simple example and it's not really doing anything helpful. Let's expand it by adding a check for a specific permission. Update your policy class to the following:

```ts
import {
  AuthorizeResult,
  PolicyDecision,
} from '@backstage/plugin-permission-common';
import {
  PermissionPolicy,
  PolicyQuery,
  PolicyQueryUser,
} from '@backstage/plugin-permission-node';

export class CustomPolicy implements PermissionPolicy {
  async handle(
    request: PolicyQuery,
    _user?: PolicyQueryUser,
  ): Promise<PolicyDecision> {
    if (request.permission.name === 'catalog.entity.delete') {
      return {
        result: AuthorizeResult.DENY,
      };
    }

    return { result: AuthorizeResult.ALLOW };
  }
}
```

Now with this policy in place, the ability to delete entities in the Catalog is not allowed for anyone. The following sections will expand on the concepts used here.

## What's in a policy?

Let's break this down a bit further. The request object of type [PolicyQuery](https://backstage.io/api/stable/types/_backstage_plugin-permission-node.index.PolicyQuery.html) is a simple wrapper around [the Permission object](https://backstage.io/api/stable/types/_backstage_plugin-permission-common.Permission.html). This permission object encapsulates information about the action that the user is attempting to perform (See [the Concepts page](./concepts.md) for more details).

In the policy above, we are checking to see if the provided action is a catalog entity delete action, which is the permission that the catalog plugin authors have created to represent the action of unregistering a catalog entity. If this is the case, we return a [Definitive Policy Decision](https://backstage.io/api/stable/types/_backstage_plugin-permission-common.DefinitivePolicyDecision.html) of DENY. In all other cases, we return ALLOW (resulting in an allow-by-default behavior).

As we confirmed in the previous section, we know that this now prevents us from unregistering catalog components. Hooray! But you may notice that this prevents _anyone_ from unregistering a component, which is not a very realistic policy. Let's improve this policy by disabling the unregister action _unless you are the owner of this component_.

## Conditional decisions

Let's change the policy to the following:

```ts
import {
  AuthorizeResult,
  PolicyDecision,
  /* highlight-add-next-line */
  isPermission,
} from '@backstage/plugin-permission-common';
/* highlight-add-start */
import {
  catalogConditions,
  createCatalogConditionalDecision,
} from '@backstage/plugin-catalog-backend/alpha';
import {
  catalogEntityDeletePermission,
} from '@backstage/plugin-catalog-common/alpha';
/* highlight-add-end */
import {
  PermissionPolicy,
  PolicyQuery,
  PolicyQueryUser,
} from '@backstage/plugin-permission-node';
/* highlight-add-next-line */
import { UserInfoService } from '@backstage/backend-plugin-api';


export class CustomPolicy implements PermissionPolicy {
  /* highlight-add-start */
  constructor(private readonly userInfo: UserInfoService) {}

  /* highlight-add-end */
  async handle(
    request: PolicyQuery,
    user?: PolicyQueryUser,
  ): Promise<PolicyDecision> {
    /* highlight-remove-next-line */
    if (request.permission.name === 'catalog.entity.delete') {
    /* highlight-add-next-line */
    if (isPermission(request.permission, catalogEntityDeletePermission)) {
      /* highlight-remove-start */
      return {
        result: AuthorizeResult.DENY,
      };
      /* highlight-remove-end */
      /* highlight-add-start */
      const ownershipRefs = user
        ? (await this.userInfo.getUserInfo(user.credentials)).ownershipEntityRefs
        : [];
      return createCatalogConditionalDecision(
        request.permission,
        catalogConditions.isEntityOwner({
          claims: ownershipRefs,
        }),
      );
      /* highlight-add-end */
    }
    return { result: AuthorizeResult.ALLOW };
  }
}
```

You will also need to update your module to pass the `UserInfoService` to the policy. Add `coreServices.userInfo` as a dependency and pass it to the constructor:

```ts
import {
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import { policyExtensionPoint } from '@backstage/plugin-permission-node/alpha';
import { CustomPolicy } from './policy/CustomPolicy';

export const permissionModuleCustom = createBackendModule({
  pluginId: 'permission',
  moduleId: 'custom',
  register({ registerInit }) {
    registerInit({
      deps: {
        policy: policyExtensionPoint,
        userInfo: coreServices.userInfo,
      },
      async init({ policy, userInfo }) {
        policy.setPolicy(new CustomPolicy(userInfo));
      },
    });
  },
});
```

Let's walk through the new code that we just added.

Instead of returning a Definitive Policy Decision, we use factory methods to construct a [Conditional Policy Decision](https://backstage.io/api/stable/types/_backstage_plugin-permission-common.ConditionalPolicyDecision.html) (See the [Concepts page](./concepts.md) for more details). Since the policy doesn't have enough information to determine if `user` is the entity owner, this criteria is encapsulated within the conditional decision. However, `createCatalogConditionalDecision` will not compile unless `request.permission` is a catalog entity [`ResourcePermission`](https://backstage.io/api/stable/types/_backstage_plugin-permission-common.ResourcePermission.html). This type constraint ensures that policies return conditional decisions that are compatible with the requested permission. To address this, we use [`isPermission`](https://backstage.io/api/stable/functions/_backstage_plugin-permission-common.isPermission.html) to ["narrow"](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) the type of `request.permission` to `ResourcePermission<'catalog-entity'>`. This matches the runtime behavior that was in place before, but you'll notice that the type of `request.permission` has changed within the scope of that `if` statement.

The `catalogConditions` object contains all of the rules defined by the catalog plugin. These rules can be combined to form a [`PermissionCriteria`](https://backstage.io/api/stable/types/_backstage_plugin-permission-common.PermissionCriteria.html) object, but for this case we only need to use the `isEntityOwner` rule. This rule accepts a list of entity refs that represent User identity and Group membership used to determine ownership. We use the `UserInfoService` to look up the user's `ownershipEntityRefs` from their credentials. We provide an empty array as a fallback since the user may be anonymous.

You should now be able to see in your Backstage app that the unregister entity button is enabled for entities that you own, but disabled for all other entities!

## Resource types

Now let's say we want to prevent all actions on catalog entities unless performed by the owner. One way to achieve this may be to simply update the `if` statement and check for each permission. If you choose to write your policy this way, it will certainly work! However, it may be difficult to maintain as the policy grows, and it may not be obvious if certain permissions are left out. We can author this same policy in a more scalable way by checking the resource type of the requested permission.

```ts
import {
  AuthorizeResult,
  PolicyDecision,
  /* highlight-remove-next-line */
  isPermission,
  /* highlight-add-next-line */
  isResourcePermission,
} from '@backstage/plugin-permission-common';
import {
  catalogConditions,
  createCatalogConditionalDecision,
} from '@backstage/plugin-catalog-backend/alpha';
/* highlight-remove-start */
import {
  catalogEntityDeletePermission,
} from '@backstage/plugin-catalog-common/alpha';
/* highlight-remove-end */
import {
  PermissionPolicy,
  PolicyQuery,
  PolicyQueryUser,
} from '@backstage/plugin-permission-node';
import { UserInfoService } from '@backstage/backend-plugin-api';

export class CustomPolicy implements PermissionPolicy {
  constructor(private readonly userInfo: UserInfoService) {}

  async handle(
    request: PolicyQuery,
    user?: PolicyQueryUser,
  ): Promise<PolicyDecision> {
    /* highlight-remove-next-line */
    if (isPermission(request.permission, catalogEntityDeletePermission)) {
    /* highlight-add-next-line */
    if (isResourcePermission(request.permission, 'catalog-entity')) {
      const ownershipRefs = user
        ? (await this.userInfo.getUserInfo(user.credentials)).ownershipEntityRefs
        : [];
      return createCatalogConditionalDecision(
        request.permission,
        catalogConditions.isEntityOwner({
          claims: ownershipRefs,
        }),
      );
    }

    return { result: AuthorizeResult.ALLOW };
  }
}
```

In this example, we use [`isResourcePermission`](https://backstage.io/api/stable/functions/_backstage_plugin-permission-common.isResourcePermission.html) to match all permissions with a resource type of `catalog-entity`. Just like `isPermission`, this helper will "narrow" the type of `request.permission` and enable the use of `createCatalogConditionalDecision`. In addition to the behavior you observed before, you should also see that catalog entities are no longer visible unless you are the owner - success!

:::note Note

Some catalog permissions do not have the `'catalog-entity'` resource type, such as [`catalogEntityCreatePermission`](https://github.com/backstage/backstage/blob/1e5e9fb9de9856a49e60fc70c38a4e4e94c69570/plugins/catalog-common/src/permissions.ts#L49). In those cases, a definitive decision is required because conditions can't be applied to an entity that does not exist yet.

:::
