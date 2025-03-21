---
id: 02-adding-a-basic-permission-check
title: 2. Adding a basic permission check
description: Explains how to add a basic permission check to a Backstage plugin
---

:::info
This documentation is written for [the new backend system](../../backend-system/index.md) which is the default since Backstage [version 1.24](../../releases/v1.24.0.md). If you are still on the old backend system, you may want to read [its own article](./02-adding-a-basic-permission-check--old.md) instead, and [consider migrating](../../backend-system/building-backends/08-migrating.md)!
:::

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

:::note Note

We use a separate `todo-list-common` package since all permissions authorized by your plugin should be exported from a ["common-library" package](https://backstage.io/docs/tooling/cli/build-system#package-roles). This allows Backstage integrators to reference them in frontend components as well as permission policies.

:::

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
import { LoggerService, HttpAuthService } from '@backstage/backend-plugin-api';
/* highlight-remove-end */
/* highlight-add-start */
import { InputError, NotAllowedError } from '@backstage/errors';
import { LoggerService, HttpAuthService, PermissionsService } from '@backstage/backend-plugin-api';
import { AuthorizeResult } from '@backstage/plugin-permission-common';
/* highlight-add-end */

export interface RouterOptions {
  logger: LoggerService;
  httpAuth: HttpAuthService;
  /* highlight-add-next-line */
  permissions: PermissionsService;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  /* highlight-remove-next-line */
  const { logger, httpAuth } = options;
  /* highlight-add-next-line */
  const { logger, httpAuth, permissions } = options;

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.json({ status: 'ok' });
  });

  router.get('/todos', async (_req, res) => {
    res.json(getAll());
  });

  router.post('/todos', async (req, res) => {
    let author: string | undefined = undefined;

    const user = await identity.getIdentity({ request: req });
    author = user?.identity.userEntityRef;
    /* highlight-add-start */
    const credentials = await httpAuth.credentials(req, { allow: ['user'] });
    const decision = (
      await permissions.authorize(
        [{ permission: todoListCreatePermission }],
        { credentials },
      )
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

Pass the `permissions` service and register the new permission to the plugin in `plugins/todo-list-backend/src/plugin.ts`:

```ts title="plugins/todo-list-backend/src/plugin.ts"
import { coreServices, createBackendPlugin } from '@backstage/backend-plugin-api';
import { createRouter } from './service/router';
/* highlight-add-next-line */
import { todoListCreatePermission } from '@internal/plugin-todo-list-common';

export const exampleTodoListPlugin = createBackendPlugin({
  pluginId: 'todolist',
  register(env) {
    env.registerInit({
      deps: {
        logger: coreServices.logger,
        httpAuth: coreServices.httpAuth,
        httpRouter: coreServices.httpRouter,
        /* highlight-add-next-line */
        permissions: coreServices.permissions,
        /* highlight-add-next-line */
        permissionsRegistry: coreServices.permissionsRegistry,
      },
      /* highlight-remove-next-line */
      async init({ logger, httpAuth, httpRouter }) {
      /* highlight-add-next-line */
      async init({ httpAuth, logger, httpRouter, permissions, permissionsRegistry }) {
        /* highlight-add-next-line */
        permissionsRegistry.addPermissions([todoListCreatePermission]);

        httpRouter.use(
          await createRouter({
            logger,
            httpAuth,
            /* highlight-add-next-line */
            permissions,
          }),
        );
        httpRouter.addAuthPolicy({
          path: '/health',
          allow: 'unauthenticated',
        });
      },
    });
  },
});
```

That's it! Now your plugin is fully configured. Let's try to test the logic by denying the permission.

## Test the authorized create endpoint

Before running this step, please make sure you followed the steps described in [Getting started](../getting-started.md) section.

In order to test the logic above, the integrators of your backstage instance need to change their permission policy to return `DENY` for our newly-created permission:

```ts title="packages/backend/src/extensions/permissionsPolicyExtension.ts"
import { createBackendModule } from '@backstage/backend-plugin-api';
import {
  PolicyDecision,
  /* highlight-add-start */
  isPermission,
  /* highlight-add-end */
  AuthorizeResult,
} from '@backstage/plugin-permission-common';
import {
  PermissionPolicy,
  /* highlight-add-start */
  PolicyQuery,
  PolicyQueryUser,
  /* highlight-add-end */
} from '@backstage/plugin-permission-node';
/* highlight-add-start */
import { todoListCreatePermission } from '@internal/plugin-todo-list-common';
/* highlight-add-end */
import { policyExtensionPoint } from '@backstage/plugin-permission-node/alpha';

class TestPermissionPolicy implements PermissionPolicy {
  /* highlight-remove-next-line */
  async handle(): Promise<PolicyDecision> {
  /* highlight-add-start */
  async handle(
    request: PolicyQuery,
    _user?: PolicyQueryUser,
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

At this point everything is working but if you run `yarn tsc` you'll get an error, let's fix this up.

Clean up the `plugins/todo-list-backend/src/service/router.test.ts`:

```ts title="plugins/todo-list-backend/src/service/router.test.ts"
import express from 'express';
import request from 'supertest';

import { createRouter } from './router';
import { mockServices } from '@backstage/backend-test-utils';

describe('createRouter', () => {
  let app: express.Express;

  beforeAll(async () => {
    const router = await createRouter({
      logger: mockServices.logger.mock(),
      httpAuth: mockServices.httpAuth.mock(),
      /* highlight-add-next-line */
      permissions: mockServices.permissions.mock(),
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

Now when you run `yarn tsc` you should have no more errors.
