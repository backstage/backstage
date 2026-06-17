---
id: permissions
sidebar_label: 003 - Permissions
title: Integrating with the Permission framework
description: How to integrate your plugin with the Backstage Permission framework
---

## Permissions

### What is the Permissions framework?

The [Backstage permissions framework](../../../permissions/overview.md) gives you a structured way to control who can do what inside your plugin. Rather than scattering authorization logic across your route handlers, you define permissions declaratively and let a central policy decide whether to allow or deny each action.

There are two kinds of permissions:

_Basic permissions_ apply to actions that don't relate to a specific resource. Creating a todo is a good example: the action either is or isn't allowed, regardless of which todo you're creating. The policy returns a definitive ALLOW or DENY.

_Resource permissions_ apply to actions on a specific resource. Reading a particular todo is a good example: whether you're allowed might depend on whether you created it. In addition to the basic ALLOW or DENY, the policy can return a CONDITIONAL decision. CONDITIONAL decisions are required to be evaluated against a specific resource and will produce a per-resource ALLOW or DENY.

The framework sits between your route handlers and your business logic. Your handler asks "is this allowed?", the framework consults the active policy, and your handler either proceeds or throws a `NotAllowedError`.

### Common integration points

Most plugins integrate at two levels:

**The backend plugin** is where you define your permissions, register them with the framework, and enforce them inside your route handlers.

**A common package** (for example, `@internal/plugin-todo-common`) is where you export the permission definitions so they can be referenced from anywhere: your backend, your frontend, and any policy that an adopter writes.

The split matters because policy authors need to reference your permission objects when writing their own policies. If those definitions live inside your backend package, you're forcing a dependency on backend code where it doesn't belong.

## Creating private TODOs

The goal here is to ensure users can only read their own todos. This is a resource permission because the decision depends on a property of the resource itself.

### Define the permission

In your common package, define a resource permission for reading todos:

```ts
// plugins/todo-common/src/permissions.ts
import { createPermission } from '@backstage/plugin-permission-common';

export const TODO_RESOURCE_TYPE = 'todo-item';

export const todoReadPermission = createPermission({
  name: 'todo.read',
  attributes: { action: 'read' },
  resourceType: TODO_RESOURCE_TYPE,
});

export const todoPermissions = [todoReadPermission];
```

The `resourceType` field ties this permission to a specific kind of resource. Exporting the string as a named constant (`TODO_RESOURCE_TYPE`) means you can import it in your backend rules rather than repeating the raw string, which prevents subtle mismatches.

### Define a permission rule

Rules are the conditions that the framework evaluates against a resource. Each rule has two parts: `apply`, which checks an in-memory resource, and `toQuery`, which converts the condition to a filter your database can use.

```ts
// plugins/todo-backend/src/service/rules.ts
import {
  createPermissionResourceRef,
  createPermissionRule,
} from '@backstage/plugin-permission-node';
import { TODO_RESOURCE_TYPE } from '@internal/plugin-todo-common';
import { z } from 'zod/v3';
import type { TodoItem } from './services/TodoListService';

export const todoResourceRef = createPermissionResourceRef<
  TodoItem,
  { createdBy: string }
>().with({
  pluginId: 'todo',
  resourceType: TODO_RESOURCE_TYPE,
});

export const isCreator = createPermissionRule({
  name: 'IS_CREATOR',
  description: 'Allow if the todo was created by the current user',
  resourceRef: todoResourceRef,
  paramsSchema: z.object({
    userRef: z.string().describe('The entity ref of the user'),
  }),
  apply(todo, { userRef }) {
    return todo.createdBy === userRef;
  },
  toQuery({ userRef }) {
    return { property: 'createdBy', values: [userRef] };
  },
});

export const rules = { isCreator };
```

The `apply` and `toQuery` functions must always have logically identical outcomes. If they diverge, users will see inconsistent results depending on whether the framework checks the database or a loaded resource.

### Register the resource type

In your plugin setup, register the resource type alongside its rules:

```ts
// plugins/todo-backend/src/plugin.ts
import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { todoReadPermission } from '@internal/plugin-todo-common';
import { todoResourceRef, rules } from './service/rules';
import { todoListServiceRef } from './services/TodoListService';

export const todoPlugin = createBackendPlugin({
  pluginId: 'todo',
  register(env) {
    env.registerInit({
      deps: {
        httpRouter: coreServices.httpRouter,
        httpAuth: coreServices.httpAuth,
        permissions: coreServices.permissions,
        permissionsRegistry: coreServices.permissionsRegistry,
        todoList: todoListServiceRef,
      },
      async init({
        httpRouter,
        httpAuth,
        permissions,
        permissionsRegistry,
        todoList,
      }) {
        permissionsRegistry.addResourceType({
          resourceRef: todoResourceRef,
          permissions: [todoReadPermission],
          rules: Object.values(rules),
          getResources: async resourceRefs => {
            return Promise.all(
              resourceRefs.map(ref =>
                todoList.getTodo({ id: ref }).catch(() => undefined),
              ),
            );
          },
        });

        const router = await createRouter({ httpAuth, permissions, todoList });
        httpRouter.use(router);
      },
    });
  },
});
```

`getResources` is called by the framework when it needs to load a resource to evaluate a conditional decision. Return `undefined` for any ref that doesn't exist.

### Enforce the permission in a route handler

In your route handler, use `authorizeConditional` for resource permissions. Unlike `authorize`, this can return a conditional decision that you apply as a filter rather than a hard stop:

```ts
// plugins/todo-backend/src/service/router.ts
import {
  HttpAuthService,
  PermissionsService,
} from '@backstage/backend-plugin-api';
import { NotAllowedError } from '@backstage/errors';
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import { todoReadPermission } from '@internal/plugin-todo-common';
import { todoListServiceRef } from './services/TodoListService';

export async function createRouter({
  httpAuth,
  permissions,
  todoList,
}: {
  httpAuth: HttpAuthService;
  permissions: PermissionsService;
  todoList: typeof todoListServiceRef.T;
}): Promise<express.Router> {
  const router = Router();
  router.use(express.json());

  router.get('/todos', async (req, res) => {
    const credentials = await httpAuth.credentials(req, { allow: ['user'] });

    const decision = (
      await permissions.authorizeConditional(
        [{ permission: todoReadPermission }],
        { credentials },
      )
    )[0];

    if (decision.result === AuthorizeResult.DENY) {
      throw new NotAllowedError();
    }

    // If CONDITIONAL, pass the conditions to your data layer as a filter.
    // If ALLOW, pass no filter (return everything).
    const result = await todoList.listTodos(
      decision.result === AuthorizeResult.CONDITIONAL
        ? decision.conditions
        : undefined,
    );

    res.json(result);
  });

  // ... other routes
  return router;
}
```

The conditional path means users only see the data the policy allows, without the handler needing to know what the policy actually is. The policy is the adopter's concern.

### Export condition helpers for policy authors

Adopters who write their own permission policy need to be able to express conditions using your rules. Export helpers from your backend package:

```ts
// plugins/todo-backend/src/conditionExports.ts
import { createConditionExports } from '@backstage/plugin-permission-node';
import { todoResourceRef, rules } from './service/rules';

const { conditions, createConditionalDecision } = createConditionExports({
  resourceRef: todoResourceRef,
  rules,
});

export const todoConditions = conditions;
export const createTodoConditionalDecision = createConditionalDecision;
```

Re-export these from your package's `src/index.ts`. An adopter can then write a policy like this:

```ts
import {
  todoConditions,
  createTodoConditionalDecision,
} from '@internal/plugin-todo-backend';
import { todoReadPermission } from '@internal/plugin-todo-common';

class MyPolicy implements PermissionPolicy {
  async handle(request: PolicyQuery, user?: PolicyQueryUser) {
    if (isPermission(request.permission, todoReadPermission)) {
      return createTodoConditionalDecision(
        request.permission,
        todoConditions.isCreator({ userRef: user?.info.userEntityRef ?? '' }),
      );
    }
    return { result: AuthorizeResult.ALLOW };
  }
}
```

This gives adopters a typed, discoverable API for customizing your plugin's access control without having to understand the internals of your data layer.

## Restricting who can create TODOs

Restricting who can create todos is simpler. There is no resource involved yet, so this is a basic permission. The policy returns a definitive ALLOW or DENY.

### Define the create permission

Add a create permission to your common package:

```ts
// plugins/todo-common/src/permissions.ts
export const todoCreatePermission = createPermission({
  name: 'todo.create',
  attributes: { action: 'create' },
});

export const todoPermissions = [todoReadPermission, todoCreatePermission];
```

### Register the permission with the framework

In your plugin setup, register basic permissions with `addPermissions` rather than `addResourceType`:

```ts
permissionsRegistry.addPermissions([todoCreatePermission]);
```

### Enforce the permission in the create handler

For basic permissions, use `authorize` instead of `authorizeConditional`. The result is always definitive:

```ts
router.post('/todos', async (req, res) => {
  const parsed = todoSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new InputError(parsed.error.toString());
  }

  const credentials = await httpAuth.credentials(req, { allow: ['user'] });

  const decision = (
    await permissions.authorize([{ permission: todoCreatePermission }], {
      credentials,
    })
  )[0];

  if (decision.result !== AuthorizeResult.ALLOW) {
    throw new NotAllowedError('You are not permitted to create todos');
  }

  const result = await todoList.createTodo(parsed.data, { credentials });

  res.status(201).json(result);
});
```

An adopter's policy can now control this permission however they like: restrict it to a specific group, require a certain annotation on the user entity, or leave it open to everyone. Your plugin does not need to know.
