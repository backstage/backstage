---
id: getting-started
title: Getting Started
description: How to get started with the permission framework as an integrator
---

Backstage integrators control permissions by writing a policy. In general terms, a policy is simply an async function which receives a request to authorize a specific action for a user and (optional) resource, and returns a decision on whether to authorize that permission. Integrators can implement their own policies from scratch, or adopt reusable policies written by others.

## Prerequisites

The permissions framework depends on a few other Backstage systems, which must be set up before we can dive into writing a policy.

### Upgrade to the latest version of Backstage

The permissions framework itself is new to Backstage and still evolving quickly. To ensure your version of Backstage has all the latest permission-related functionality, it’s important to upgrade to the latest version. The [Backstage upgrade helper](https://backstage.github.io/upgrade-helper/) is a great tool to help ensure that you’ve made all the necessary changes during the upgrade!

### Supply an identity resolver to populate group membership on sign in

**Note**: If you are working off of an existing Backstage instance, you likely already have some form of an identity resolver set up.

Like many other parts of Backstage, the permissions framework relies on information about group membership. This simplifies authoring policies through the use of groups, rather than requiring each user to be listed in the configuration. Group membership is also often useful for conditional permissions, for example allowing permissions to act on an entity to be granted when a user is a member of a group that owns that entity.

## Optionally add cookie-based authentication

Asset requests initiated by the browser will not include a token in the `Authorization` header. If these requests check authorization through the permission framework, as done in plugins like TechDocs, then you'll need to set up cookie-based authentication. Refer to the ["Authenticate API requests"](https://github.com/backstage/backstage/blob/master/contrib/docs/tutorials/authenticate-api-requests.md) tutorial for a demonstration on how to implement this behavior.

## Integrating the permission framework with your Backstage instance

### 1. Set up the permission backend

The permissions framework uses a new `permission-backend` plugin to accept authorization requests from other plugins across your Backstage instance. The Backstage backend does not include this permission backend by default, so you will need to add it:

1. Add `@backstage/plugin-permission-backend` and `@backstage/plugin-permission-backend-module-allow-all-policy` to your backend dependencies, this will add the permission backend and a policy that allows all permissions:

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/plugin-permission-backend
```

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/plugin-permission-backend-module-allow-all-policy
```

2. Add the following to `packages/backend/src/index.ts`. This adds the permission-backend router, and configures it with a policy which allows everything.

```typescript title="packages/backend/src/index.ts"
import { createBackend } from '@backstage/backend-defaults';
const backend = createBackend();
// ...
/* highlight-add-next-line */
backend.add(import('@backstage/plugin-permission-backend/alpha'));
/* highlight-add-next-line */
backend.add(
  import('@backstage/plugin-permission-backend-module-allow-all-policy'),
);
// ...
backend.start();
```

### 2. Enable and test the permissions system

Now that the permission backend is running, it’s time to enable the permissions framework and make sure it’s working properly.

1. Set the property `permission.enabled` to `true` in `app-config.yaml`.

```yaml title="app-config.yaml"
permission:
  enabled: true
```

2. Its now all wired up and working, great! But perhaps we don't want to simply allow everything, lets try and create our own policy, to do this you can create a new folder in `packages/backend/src` called `permissions` and create a new file called `policy.ts`, in that file we can add the following to create a policy that denies deleting entities from the catalog:

```ts title="packages/backend/src/permissions/policy.ts"
import {
  AuthorizeResult,
  PolicyDecision,
} from '@backstage/plugin-permission-common';
import {
  PermissionPolicy,
  PolicyQuery,
} from '@backstage/plugin-permission-node';

export class DenyCatalogDeletePolicy implements PermissionPolicy {
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

3. We then need to use the permissions backend policy extension point to register our policy, to do this we can add the following to `packages/backend/src/index.ts`:

```ts title="packages/backend/src/index.ts"
import { createBackend } from '@backstage/backend-defaults';
import { DenyCatalogDeletePolicy } from './permissions/policy';
const backend = createBackend();
// ...
backend.add(import('@backstage/plugin-permission-backend/alpha'));
/* highlight-remove-next-line */
backend.add(
  import('@backstage/plugin-permission-backend-module-allow-all-policy'),
);
/* highlight-add-next-line */
backend.add(
  createBackendModule({
    pluginId: 'permission',
    moduleId: 'deny-catalog-delete-policy',
    register(reg) {
      reg.registerInit({
        deps: { policy: policyExtensionPoint },
        async init({ policy }) {
          policy.setPolicy(new DenyCatalogDeletePolicy());
        },
      });
    },
  }),
);
// ...
backend.start();
```

4. Now that you’ve made this change, you should find that the unregister entity menu option on the catalog entity page is disabled.

![Entity detail page showing disabled unregister entity context menu entry](../assets/permissions/disabled-unregister-entity.png)

Now that the framework is fully configured, you can craft a permission policy that works best for your organization by utilizing a provided authorization method or by [writing your own policy](./writing-a-policy.md)!
