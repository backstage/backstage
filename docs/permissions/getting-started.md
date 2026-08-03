---
id: getting-started
title: Getting Started
description: How to get started with the permission framework as an integrator
---

Backstage integrators control permissions by writing a policy. In general terms, a policy is simply an async function which receives a request to authorize a specific action for a user and (optional) resource, and returns a decision on whether to authorize that permission. Integrators can implement their own policies from scratch, or adopt reusable policies written by others.

## Prerequisites

The permissions framework depends on a few other Backstage systems, which must be set up before we can dive into writing a policy.

### Upgrade to the latest version of Backstage

To ensure your version of Backstage has all the latest permission-related functionality, it’s important to upgrade to the latest version. The [Backstage upgrade helper](https://backstage.github.io/upgrade-helper/) is a great tool to help ensure that you’ve made all the necessary changes during the upgrade!

### Supply an identity resolver to populate group membership on sign in

**Note**: If you are working off of an existing Backstage instance, you likely already have some form of an identity resolver set up.

Like many other parts of Backstage, the permissions framework relies on information about group membership. This simplifies authoring policies through the use of groups, rather than requiring each user to be listed in the configuration. Group membership is also often useful for conditional permissions, for example allowing permissions to act on an entity to be granted when a user is a member of a group that owns that entity.

[The IdentityResolver docs](../auth/identity-resolver.md) describe the process for resolving group membership on sign in.

## Create a custom permission policy

We'll create a custom permission policy using `yarn new` to scaffold a new module and validate the framework is set up correctly:

1. Backstage ships with a default allow-all policy. We want to remove that so our custom policy takes effect. Remove the following line from your backend:

   ```ts title="packages/backend/src/index.ts"
   // permission plugin
   backend.add(import('@backstage/plugin-permission-backend'));
   /* highlight-remove-start */
   backend.add(
     import('@backstage/plugin-permission-backend-module-allow-all-policy'),
   );
   /* highlight-remove-end */
   ```

2. From your Backstage root directory, scaffold a new permission policy module. When prompted, enter `custom` as the module ID:

   ```bash title="from your Backstage root directory"
   yarn new --select permission-policy-module
   ```

   The scaffolded module contains a policy class in `src/policy/` that allows all requests by default:

   ```ts
   import { UserInfoService } from '@backstage/backend-plugin-api';
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
     constructor(private readonly userInfo: UserInfoService) {}

     async handle(
       _request: PolicyQuery,
       _user?: PolicyQueryUser,
     ): Promise<PolicyDecision> {
       return { result: AuthorizeResult.ALLOW };
     }
   }
   ```

3. The template automatically registers the new module in your backend. Verify that `packages/backend/src/index.ts` now includes a line like the following:

   ```ts title="packages/backend/src/index.ts"
   // permission plugin
   backend.add(import('@backstage/plugin-permission-backend'));
   /* highlight-add-next-line */
   backend.add(
     import('@internal/backstage-plugin-permission-backend-module-custom'),
   );
   ```

You now have a custom permission policy in place. This will help us test that the permission framework is working in the next section.

## Enable and test the permissions system

Now let's test that the permissions framework is working. We'll use the custom permission policy as is, then modify it to deny access:

1. Set the property `permission.enabled` to `true` in `app-config.yaml`.

   ```yaml title="app-config.yaml"
   permission:
     enabled: true
   ```

2. Now run `yarn start`. Backstage should load up in your browser.
3. You should see that you have entities in your Catalog.
4. In the policy class, change `return { result: AuthorizeResult.ALLOW };` to `return { result: AuthorizeResult.DENY };`.
5. Run `yarn start` once again. Backstage should load up in your browser.
6. This time you should not see any entities in your Catalog. If you do, then something went wrong along the way and you'll need to review the steps above.
7. Revert the change we made in step 4 so that the line reads `return { result: AuthorizeResult.ALLOW };`.

Congratulations! Now that the framework is fully configured, you can craft a permission policy that works best for your organization by [writing your own policy](./writing-a-policy.md)!
