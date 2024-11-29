---
id: getting-started
title: Getting Started
description: How to get started with the permission framework as an integrator
---

:::info
This documentation is written for [the new backend system](../backend-system/index.md) which is the default since Backstage [version 1.24](../releases/v1.24.0.md). If you are still on the old backend system, you may want to read [its own article](./getting-started--old.md) instead, and [consider migrating](../backend-system/building-backends/08-migrating.md)!
:::

Backstage integrators control permissions by writing a policy. In general terms, a policy is simply an async function which receives a request to authorize a specific action for a user and (optional) resource, and returns a decision on whether to authorize that permission. Integrators can implement their own policies from scratch, or adopt reusable policies written by others.

## Prerequisites

The permissions framework depends on a few other Backstage systems, which must be set up before we can dive into writing a policy.

### Upgrade to the latest version of Backstage

To ensure your version of Backstage has all the latest permission-related functionality, it’s important to upgrade to the latest version. The [Backstage upgrade helper](https://backstage.github.io/upgrade-helper/) is a great tool to help ensure that you’ve made all the necessary changes during the upgrade!

### Supply an identity resolver to populate group membership on sign in

**Note**: If you are working off of an existing Backstage instance, you likely already have some form of an identity resolver set up.

Like many other parts of Backstage, the permissions framework relies on information about group membership. This simplifies authoring policies through the use of groups, rather than requiring each user to be listed in the configuration. Group membership is also often useful for conditional permissions, for example allowing permissions to act on an entity to be granted when a user is a member of a group that owns that entity.

[The IdentityResolver docs](../auth/identity-resolver.md) describe the process for resolving group membership on sign in.

## Test Permission Policy

To help validate the permission framework is setup we'll create a Test Permission Policy:

1. Backstage ships with a default Allow All Policy, we want to remove that as it would override our Test Permission Policy. To do this remove the following line:

   ```ts title="packages/backend/src/index.ts"
   // permission plugin
   backend.add(import('@backstage/plugin-permission-backend'));
   /* highlight-remove-start */
   backend.add(
     import('@backstage/plugin-permission-backend-module-allow-all-policy'),
   );
   /* highlight-remove-end */
   ```

2. Now we need to add the `@backstage/backend-plugin-api` package:

   ```bash title="from your Backstage root directory"
   yarn --cwd packages/backend add @backstage/backend-plugin-api
   ```

3. Next we will create an `extensions` folder under `packages/backend/src`
4. In this new `extensions` folder we will add a new file called: `permissionsPolicyExtension.ts`
5. Copy the following into the new `permissionsPolicyExtension.ts` file:

   ```ts title="packages/backend/src/extensions/permissionsPolicyExtension.ts"
   import { createBackendModule } from '@backstage/backend-plugin-api';
   import {
     PolicyDecision,
     AuthorizeResult,
   } from '@backstage/plugin-permission-common';
   import { PermissionPolicy } from '@backstage/plugin-permission-node';
   import { policyExtensionPoint } from '@backstage/plugin-permission-node/alpha';

   class TestPermissionPolicy implements PermissionPolicy {
     async handle(): Promise<PolicyDecision> {
       return { result: AuthorizeResult.ALLOW };
     }
   }

   export default createBackendModule({
     pluginId: 'permission',
     moduleId: 'permission-policy',
     register(reg) {
       reg.registerInit({
         deps: { policy: policyExtensionPoint },
         async init({ policy }) {
           policy.setPolicy(new TestPermissionPolicy());
         },
       });
     },
   });
   ```

6. We now need to register this in the backend. We will do this by adding the follow line:

   ```ts title="packages/backend/src/index.ts"
   // permission plugin
   backend.add(import('@backstage/plugin-permission-backend'));
   /* highlight-add-next-line */
   backend.add(import('./extensions/permissionsPolicyExtension'));
   ```

You now have a Test Permission Policy in place, this will help us test that the permission framework is working in the next section.

## Enable and test the permissions system

Now lets test end to end that the permissions framework is setup and configured properly we will use the Test Permission Policy we create above as is, then modify it do deny access which will confirm everything is working as expected. Here's how to do that:

1. Set the property `permission.enabled` to `true` in `app-config.yaml`.

   ```yaml title="app-config.yaml"
   permission:
     enabled: true
   ```

2. Now run `yarn dev`, Backstage should load up in your browser
3. You should see that you have entities in your Catalog, pretty simple
4. Let's change this line in our Test Permission Policy `return { result: AuthorizeResult.ALLOW };` to be `return { result: AuthorizeResult.DENY };`
5. Run `yarn dev` once again, Backstage should load up in your browser
6. This time you should not see any entities in your Catalog, if you do then something went wrong along the way and you'll need to review the steps above
7. Revert the change we made in step 4 so that the line looks like this: `return { result: AuthorizeResult.ALLOW };`

Congratulations! Now that the framework is fully configured, you can craft a permission policy that works best for your organization by [writing your own policy](./writing-a-policy.md)!
