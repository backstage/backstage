# How to disable the Register New Component button

## Overview

This is a tutorial on how to disable the `Register Existing Component` button
as shown in the screenshot below.

The general steps are:

1. Enable Backstage's authorization framework
1. Create a policy which denies `catalog.entity.create`
1. Wire up the policy

## Enable Backstage's authorization framework

1. Edit `app-config.yaml` and add `permission.enabled` and set that to `true`

    ```yaml
    permission:
        enabled: true
    ```

    By default, this setting is not present and you'll have to add that to
    your configuration.

    When set to `true`, this instructs the framework to send authorization
    requests.

1. The next step is to uncomment / enable the `backend.auth.keys` section.

    ```yaml
    auth:
        keys:
        - secret: ${BACKEND_SECRET}
    ```

    Enabling this section, allows backend plugins to be able to talk to one
    another when `permission.enabled` is `true`. This allows backends to be
    able to identify whether the request is coming from a user or another
    backend.

    We will set `${BACKEND_SECRET}` later.

1. Install the `@backstage/plugin-permission-backend` module in the `packages/backend` folder

    ```bash
    cd packages/backend
    yarn add @backstage/plugin-permission-backend
    ```

## Create policy

### Background

By default, the existing `Register Existing Component` button is wrapped in
a conditional similar to:

```typescript
{allowed && (
    <CreateButton
     title="Register Existing Component"
     to={registerComponentLink && registerComponentLink()}
    />
)}
```

Digging further, we can see that `allowed` is set as follows:

```typescript
const { allowed } = usePermission({
  permission: catalogEntityCreatePermission,
});
```

Thus, if `catalogEntityCreatePermission` returns true, then `allowed` is true and
the button is rendered.

For this tutorial, we need `catalogEntityCreatePermission` to return false.

### Deny catalog.entity.create

If one does not already exist, create `packages/backend/src/plugins/permission.ts`
with the following contents:

```typescript
// Original https://github.com/backstage/backstage/blob/master/packages/backend/src/plugins/permission.ts

import { BackstageIdentityResponse } from '@backstage/plugin-auth-node';
import { createRouter } from '@backstage/plugin-permission-backend';
import {
  AuthorizeResult,
  PolicyDecision,
} from '@backstage/plugin-permission-common';
import {
  PermissionPolicy,
  PolicyQuery,
} from '@backstage/plugin-permission-node';

import { Router } from 'express';
import { PluginEnvironment } from '../types';

class DemoPolicy implements PermissionPolicy {
  async handle(
    request: PolicyQuery,
    user?: BackstageIdentityResponse,
  ): Promise<PolicyDecision> {
    if (request.permission.name === 'catalog.entity.create') {
        return {
            result: AuthorizeResult.DENY,
        }
    }

    // Default behavior
    return {
      result: AuthorizeResult.ALLOW,
    };
  }
}

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    config: env.config,
    logger: env.logger,
    discovery: env.discovery,
    policy: new DemoPolicy(),
    identity: env.identity,
  });
}
```

This policy is called `DemoPolicy` and by default, we will `ALLOW` any
permission (the existing default behavior).

However, if the requested permission name is `catalog.entity.create`,
we will `DENY` that request.

## Wire it up

After the policy has been created, Backstage needs to know what to do when 
a request for that page is made.

1. Edit `packages/backend/src/index.ts`

1. Import the policy we just created

    ```typescript
    import permission from './plugins/permission';
    ```

1. In the `makeCreateEnv` function, replace `ServerTokenManager.noop()` with
   something that will actually generate tokens:

    ```typescript
    // BEFORE
    const tokenManager = ServerTokenManager.noop();

    // AFTER
    const tokenManager = ServerTokenManager.fromConfig(config, { logger: root });
    ```

1. In the `main` function:

    1. First create an environment for our permission:

        ```typescript
        const permissionEnv = useHotMemoize(module, () => createEnv('permission'));
        ```

    1. Add that environment to the list of routes:

        ```typescript
        apiRouter.use('/permission', await permission(permissionEnv));
        ```

## Validate changes

1. Before starting the server, set a secret for `BACKEND_SECRET`.
   For example:

   ```bash
   export BACKEND_SECRET=123abcde
   ```

1. Start up the server

    ```bash
    yarn dev
    ```

1. Navigate to Create and confirm that the button no longer shows up.
