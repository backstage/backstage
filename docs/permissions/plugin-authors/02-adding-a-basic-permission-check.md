---
id: 02-adding-a-basic-permission-check
title: 2. Adding a basic permission check
description: Explains how to add a basic permission check to a Backstage plugin
---

If the outcome of a permission check doesn't need to change for different [resources](../concepts.md#resources-and-rules), you can use a _basic permission check_. For this kind of check, we simply need to define a [permission](../concepts.md#resources-and-rules), and call `authorize` with it.

For this tutorial, we'll use a basic permission check to authorize the `create` endpoint in our todo-backend. This will allow Backstage integrators to control whether each of their users is authorized to create todos by adjusting their [permission policy](../concepts.md#policy).

We'll start by creating a new permission, and then we'll use the permission api to call `authorize` with it during todo creation.

## Creating a new permission

Let's navigate to the file `plugins/todo-list-common/src/permissions.ts` and add our first permission:

```diff
  import { createPermission } from '@backstage/plugin-permission-common';

- export const tempExamplePermission = createPermission({
-   name: 'temp.example.noop',
-   attributes: {},
+ export const todoListCreatePermission = createPermission({
+   name: 'todo.list.create',
+   attributes: { action: 'create' },
  });

- export const todoListPermissions = [tempExamplePermission];
+ export const todoListPermissions = [todoListCreatePermission];
```

For this tutorial, we've automatically exported all permissions from this file (see `plugins/todo-list-common/src/index.ts`).

> Note: We use a separate `todo-list-common` package since all permissions authorized by your plugin should be exported from a ["common-library" package](https://backstage.io/docs/local-dev/cli-build-system#package-roles). This allows Backstage integrators to reference them in frontend components and permission policies.

## Authorizing using the new permission

Install the following module:

```
$ yarn workspace @internal/plugin-todo-list-backend \
  add @backstage/plugin-permission-common @internal/plugin-todo-list-common
```

Edit `plugins/todo-list-backend/src/service/router.ts`:

```diff
...

- import { InputError } from '@backstage/errors';
- import { IdentityApi } from '@backstage/plugin-auth-node';
+ import { InputError, NotAllowedError } from '@backstage/errors';
+ import { getBearerTokenFromAuthorizationHeader, IdentityApi } from '@backstage/plugin-auth-node';
+ import { PermissionEvaluator, AuthorizeResult } from '@backstage/plugin-permission-common';
+ import { todoListCreatePermission } from '@internal/plugin-todo-list-common';

...

  export interface RouterOptions {
    logger: Logger;
    identity: IdentityApi;
+   permissions: PermissionEvaluator;
  }

  export async function createRouter(
    options: RouterOptions,
  ): Promise<express.Router> {
-   const { logger, identity } = options;
+   const { logger, identity, permissions } = options;

    ...

    router.post('/todos', async (req, res) => {
      let author: string | undefined = undefined;

      const user = await identity.getIdentity({ request: req });
      author = user?.identity.userEntityRef;
+     const token = getBearerTokenFromAuthorizationHeader(
+       req.header('authorization'),
+     );
+     const decision = (
+       await permissions.authorize([{ permission: todoListCreatePermission }], {
+       token,
+       })
+     )[0];

+     if (decision.result === AuthorizeResult.DENY) {
+       throw new NotAllowedError('Unauthorized');
+     }

      if (!isTodoCreateRequest(req.body)) {
        throw new InputError('Invalid payload');
      }

      const todo = add({ title: req.body.title, author });
      res.json(todo);
  });
```

Pass the `permissions` object to the plugin in `packages/backend/src/plugins/todolist.ts`:

```diff
  import { IdentityClient } from '@backstage/plugin-auth-backend';
  import { createRouter } from '@internal/plugin-todo-list-backend';
  import { Router } from 'express';
  import { PluginEnvironment } from '../types';

  export default async function createPlugin({
    logger,
    discovery,
+   permissions,
  }: PluginEnvironment): Promise<Router> {
    return await createRouter({
      logger,
      identity: new IdentityClient({
        discovery,
        issuer: await discovery.getExternalBaseUrl('auth'),
      }),
+     permissions,
    });
  }
```

That's it! Now your plugin is fully configured. Let's try to test the logic by denying the permission.

## Test the authorized create endpoint

Before running this step, please make sure you followed the steps described in [Getting started](../getting-started.md) section.

In order to test the logic above, the integrators of your backstage instance need to change their permission policy to return `DENY` for our newly-created permission:

```diff
// packages/backend/src/plugins/permission.ts

+ import {
+   BackstageIdentityResponse,
+ } from '@backstage/plugin-auth-node';
  import {
    PermissionPolicy,
+   PolicyQuery,
  } from '@backstage/plugin-permission-node';
+ import { isPermission } from '@backstage/plugin-permission-common';
+ import { todoListCreatePermission } from '@internal/plugin-todo-list-common';

  class TestPermissionPolicy implements PermissionPolicy {
-   async handle(): Promise<PolicyDecision> {
+   async handle(
+     request: PolicyQuery,
+     user?: BackstageIdentityResponse,
+   ): Promise<PolicyDecision> {
+     if (isPermission(request.permission, todoListCreatePermission)) {
+       return {
+         result: AuthorizeResult.DENY,
+       };
+     }
+
      return {
        result: AuthorizeResult.ALLOW,
      };
  }
```

Now the frontend should show an error whenever you try to create a new Todo item.

Let's flip the result back to `ALLOW` before moving on.

```diff
  if (isPermission(request.permission, todoListCreatePermission)) {
    return {
-     result: AuthorizeResult.DENY,
+     result: AuthorizeResult.ALLOW,
    };
  }
```

At this point everything is working but if you run `yarn tsc` you'll get some errors, let's fix those up.

First we'll clean up the `plugins/todo-list-backend/src/service/router.test.ts`:

```diff
  import { getVoidLogger } from '@backstage/backend-common';
  import { DefaultIdentityClient } from '@backstage/plugin-auth-node';
+ import { PermissionEvaluator } from '@backstage/plugin-permission-common';
  import express from 'express';
  import request from 'supertest';

  import { createRouter } from './router';

+ const mockedAuthorize: jest.MockedFunction<PermissionEvaluator['authorize']> =
+   jest.fn();
+ const mockedPermissionQuery: jest.MockedFunction<
+   PermissionEvaluator['authorizeConditional']
+ > = jest.fn();

+ const permissionEvaluator: PermissionEvaluator = {
+   authorize: mockedAuthorize,
+   authorizeConditional: mockedPermissionQuery,
+ };

  describe('createRouter', () => {
    let app: express.Express;

    beforeAll(async () => {
      const router = await createRouter({
        logger: getVoidLogger(),
        identity: {} as DefaultIdentityClient,
+       permissions: toPermissionEvaluator,
      });
      app = express().use(router);
    });

    beforeEach(() => {
      jest.resetAllMocks();
    });

    describe('GET /health', () => {
      it('returns ok', async () => {
        const response = await request(app).get('/health');

        expect(response.status).toEqual(200);
        expect(response.body).toEqual({ status: 'ok' });
      });
    });
  });

```

Then we want to update the `plugins/todo-list-backend/src/service/standaloneServer.ts`, first we need to add the `@backstage/plugin-permission-node` package to `plugins/todo-list-backend/package.json` and then we can make the following edits:

```diff
  import {
    createServiceBuilder,
    loadBackendConfig,
    SingleHostDiscovery,
+   ServerTokenManager,
  } from '@backstage/backend-common';
  import { DefaultIdentityClient } from '@backstage/plugin-auth-node';
  import { ServerPermissionClient } from '@backstage/plugin-permission-node';
  import { Server } from 'http';
  import { Logger } from 'winston';
  import { createRouter } from './router';

  export interface ServerOptions {
    port: number;
    enableCors: boolean;
    logger: Logger;
  }

  export async function startStandaloneServer(
    options: ServerOptions,
  ): Promise<Server> {
    const logger = options.logger.child({ service: 'todo-list-backend' });
    logger.debug('Starting application server...');
    const config = await loadBackendConfig({ logger, argv: process.argv });
    const discovery = SingleHostDiscovery.fromConfig(config);
+   const tokenManager = ServerTokenManager.fromConfig(config, {
+     logger,
+   });
+   const permissions = ServerPermissionClient.fromConfig(config, {
+     discovery,
+     tokenManager,
+   });
    const router = await createRouter({
      logger,
      identity: DefaultIdentityClient.create({
        discovery,
        issuer: await discovery.getExternalBaseUrl('auth'),
      }),
+     permissions,
    });

    let service = createServiceBuilder(module)
      .setPort(options.port)
      .addRouter('/todo-list', router);
    if (options.enableCors) {
      service = service.enableCors({ origin: 'http://localhost:3000' });
    }

    return await service.start().catch(err => {
      logger.error(err);
      process.exit(1);
    });
  }

  module.hot?.accept();
```

Now when you run `yarn tsc` you should have no more errors.
