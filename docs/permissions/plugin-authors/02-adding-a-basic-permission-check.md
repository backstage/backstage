---
id: 02-adding-a-basic-permission-check
title: 2. Adding a basic permission check
description: Explains how to add a basic permission check to a Backstage plugin
---

If the outcome of a permission check doesn't need to change for different [resources](../../references/glossary.md#resource-permission-plugin), you can use a _basic permission check_. For this kind of check, we simply need to define a permission, and call `authorize` with it.

For this tutorial, we'll use a basic permission check to authorize the `create` endpoint in our todo-backend. This will allow Backstage integrators to control whether each of their users is authorized to create todos by adjusting their [permission policy](../../references/glossary.md#policy-permission-plugin).

We'll start by creating a new permission, and then we'll use the permission api to call `authorize` with it during todo creation.

## Creating a new permission

Let's navigate to the file `plugins/todo-list-common/src/permissions.ts` and add our first permission:

```ts title="plugins/todo-list-common/src/permissions.ts"
import { createPermission } from '@backstage/plugin-permission-common';

/* highlight-remove-start */
export const tempExamplePermission = createPermission({
  name: 'temp.example.noop',
  attributes: {},
/* highlight-remove-end */
/* highlight-add-start */
export const todoListCreatePermission = createPermission({
  name: 'todo.list.create',
  attributes: { action: 'create' },
/* highlight-add-end */
});

/* highlight-remove-next-line */
export const todoListPermissions = [tempExamplePermission];
/* highlight-add-next-line */
export const todoListPermissions = [todoListCreatePermission];
```

For this tutorial, we've automatically exported all permissions from this file (see `plugins/todo-list-common/src/index.ts`).

> Note: We use a separate `todo-list-common` package since all permissions authorized by your plugin should be exported from a ["common-library" package](https://backstage.io/docs/local-dev/cli-build-system#package-roles). This allows Backstage integrators to reference them in frontend components as well as permission policies.

## Authorizing using the new permission

Install the following module:

```
$ yarn workspace @internal/plugin-todo-list-backend \
  add @backstage/plugin-permission-common @backstage/plugin-permission-node @internal/plugin-todo-list-common
```

Edit `plugins/todo-list-backend/src/service/router.ts`:

```ts title="plugins/todo-list-backend/src/service/router.ts"
/* highlight-remove-start */
import { InputError } from '@backstage/errors';
import { IdentityApi } from '@backstage/plugin-auth-node';
/* highlight-remove-end */
/* highlight-add-start */
import { InputError, NotAllowedError } from '@backstage/errors';
import { getBearerTokenFromAuthorizationHeader, IdentityApi } from '@backstage/plugin-auth-node';
import { PermissionEvaluator, AuthorizeResult } from '@backstage/plugin-permission-common';
import { createPermissionIntegrationRouter } from '@backstage/plugin-permission-node';
import { todoListCreatePermission } from '@internal/plugin-todo-list-common';
/* highlight-add-end */

export interface RouterOptions {
  logger: Logger;
  identity: IdentityApi;
  /* highlight-add-next-line */
  permissions: PermissionEvaluator;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  /* highlight-remove-next-line */
  const { logger, identity } = options;
  /* highlight-add-next-line */
  const { logger, identity, permissions } = options;

  /* highlight-add-start */
  const permissionIntegrationRouter = createPermissionIntegrationRouter({
    permissions: [todoListCreatePermission],
  });
  /* highlight-add-end */

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.json({ status: 'ok' });
  });

  /* highlight-add-next-line */
  router.use(permissionIntegrationRouter);

  router.get('/todos', async (_req, res) => {
    res.json(getAll());
  });

  router.post('/todos', async (req, res) => {
    let author: string | undefined = undefined;

    const user = await identity.getIdentity({ request: req });
    author = user?.identity.userEntityRef;
    /* highlight-add-start */
    const token = getBearerTokenFromAuthorizationHeader(
      req.header('authorization'),
    );
    const decision = (
      await permissions.authorize([{ permission: todoListCreatePermission }], {
      token,
      })
    )[0];

    if (decision.result === AuthorizeResult.DENY) {
      throw new NotAllowedError('Unauthorized');
    }
    /* highlight-add-end */

    if (!isTodoCreateRequest(req.body)) {
      throw new InputError('Invalid payload');
    }

    const todo = add({ title: req.body.title, author });
    res.json(todo);
  });

  // ...
```

Pass the `permissions` object to the plugin in `packages/backend/src/plugins/todolist.ts`:

```ts title="packages/backend/src/plugins/todolist.ts"
import { DefaultIdentityClient } from '@backstage/plugin-auth-node';
import { createRouter } from '@internal/plugin-todo-list-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin({
  logger,
  discovery,
  /* highlight-add-next-line */
  permissions,
}: PluginEnvironment): Promise<Router> {
  return await createRouter({
    logger,
    identity: DefaultIdentityClient.create({
      discovery,
      issuer: await discovery.getExternalBaseUrl('auth'),
    }),
    /* highlight-add-next-line */
    permissions,
  });
}
```

That's it! Now your plugin is fully configured. Let's try to test the logic by denying the permission.

## Test the authorized create endpoint

Before running this step, please make sure you followed the steps described in [Getting started](../getting-started.md) section.

In order to test the logic above, the integrators of your backstage instance need to change their permission policy to return `DENY` for our newly-created permission:

```ts title="packages/backend/src/plugins/permission.ts"
/* highlight-add-start */
import {
  BackstageIdentityResponse,
} from '@backstage/plugin-auth-node';
/* highlight-add-end */
import {
  PermissionPolicy,
  /* highlight-add-next-line */
  PolicyQuery,
} from '@backstage/plugin-permission-node';
/* highlight-add-start */
import { isPermission } from '@backstage/plugin-permission-common';
import { todoListCreatePermission } from '@internal/plugin-todo-list-common';
/* highlight-add-end */

class TestPermissionPolicy implements PermissionPolicy {
  /* highlight-remove-next-line */
  async handle(): Promise<PolicyDecision> {
  /* highlight-add-start */
  async handle(
    request: PolicyQuery,
    _user?: BackstageIdentityResponse,
  ): Promise<PolicyDecision> {
    if (isPermission(request.permission, todoListCreatePermission)) {
      return {
        result: AuthorizeResult.DENY,
      };
    }
  /* highlight-add-end */

    return {
      result: AuthorizeResult.ALLOW,
    };
}
```

Now the frontend should show an error whenever you try to create a new Todo item.

Let's flip the result back to `ALLOW` before moving on.

```ts
if (isPermission(request.permission, todoListCreatePermission)) {
  return {
    /* highlight-remove-next-line */
    result: AuthorizeResult.DENY,
    /* highlight-add-next-line */
    result: AuthorizeResult.ALLOW,
  };
}
```

At this point everything is working but if you run `yarn tsc` you'll get some errors, let's fix those up.

First we'll clean up the `plugins/todo-list-backend/src/service/router.test.ts`:

```ts title="plugins/todo-list-backend/src/service/router.test.ts"
import { getVoidLogger } from '@backstage/backend-common';
import { DefaultIdentityClient } from '@backstage/plugin-auth-node';
/* highlight-add-next-line */
import { PermissionEvaluator } from '@backstage/plugin-permission-common';
import express from 'express';
import request from 'supertest';

import { createRouter } from './router';

/* highlight-add-start */
const mockedAuthorize: jest.MockedFunction<PermissionEvaluator['authorize']> =
  jest.fn();
const mockedPermissionQuery: jest.MockedFunction<
  PermissionEvaluator['authorizeConditional']
> = jest.fn();

const permissionEvaluator: PermissionEvaluator = {
  authorize: mockedAuthorize,
  authorizeConditional: mockedPermissionQuery,
};
/* highlight-add-end */

describe('createRouter', () => {
  let app: express.Express;

  beforeAll(async () => {
    const router = await createRouter({
      logger: getVoidLogger(),
      identity: {} as DefaultIdentityClient,
      /* highlight-add-next-line */
      permissions: permissionEvaluator,
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

Then we want to update the `plugins/todo-list-backend/src/service/standaloneServer.ts`:

```ts title="plugins/todo-list-backend/src/service/standaloneServer.ts"
import {
  createServiceBuilder,
  loadBackendConfig,
  SingleHostDiscovery,
  /* highlight-add-next-line */
  ServerTokenManager,
} from '@backstage/backend-common';
import { DefaultIdentityClient } from '@backstage/plugin-auth-node';
/* highlight-add-next-line */
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
  /* highlight-add-start */
  const tokenManager = ServerTokenManager.fromConfig(config, {
    logger,
  });
  const permissions = ServerPermissionClient.fromConfig(config, {
    discovery,
    tokenManager,
  });
  /* highlight-add-end */
  const router = await createRouter({
    logger,
    identity: DefaultIdentityClient.create({
      discovery,
      issuer: await discovery.getExternalBaseUrl('auth'),
    }),
    /* highlight-add-next-line */
    permissions,
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

Finally, we need to update `plugins/todo-list-backend/src/plugin.ts`:

```ts title="plugins/todo-list-backend/src/plugin.ts"
import { loggerToWinstonLogger } from '@backstage/backend-common';
import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { createRouter } from './service/router';

/**
* The example TODO list backend plugin.
*
* @public
*/
export const exampleTodoListPlugin = createBackendPlugin({
  pluginId: 'exampleTodoList',
  register(env) {
    env.registerInit({
      deps: {
        identity: coreServices.identity,
        logger: coreServices.logger,
        httpRouter: coreServices.httpRouter,
        /* highlight-add-next-line */
        permissions: coreServices.permissions,
      },
      /* highlight-remove-next-line */
      async init({ identity, logger, httpRouter }) {
      /* highlight-add-next-line */
      async init({ identity, logger, httpRouter, permissions }) {
        httpRouter.use(
          await createRouter({
            identity,
            logger: loggerToWinstonLogger(logger),
            permissions,
          }),
        );
      },
    });
  },
});
```

Now when you run `yarn tsc` you should have no more errors.
