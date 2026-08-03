---
id: permissions
sidebar_label: 002 - Permissions
title: Integrating with the Permission framework
description: Restrict plugin resources using ownership from the Backstage Software Catalog
---

## Permissions

### What is the Permission framework?

The [Backstage permissions framework](../../../permissions/overview.md) answers
questions such as "may this user read this TODO?" The todo plugin represents
that question as a
[permission](../../../permissions/concepts.md#permission) named `todo.read`.
The Backstage app provides a
[**permission policy**](../../../permissions/concepts.md#policy) that decides
who is allowed.

A policy can allow the request, deny it, or return a
[condition](../../../permissions/concepts.md#conditional-decisions). A
condition means "allow the request only for matching TODOs." This guide uses a
condition that keeps TODOs connected to Components owned by the signed-in
user's Groups.

The check works like this:

```text
Groups the user belongs to
  -> Components owned by those Groups
  -> TODOs connected to those Components
```

The same `todo.read` check protects the todo API, the **Todos** tab on a
Component page, Search results, and links from Notifications.

## Restricting TODOs to catalog owners

### Prerequisites

Before starting, complete [Catalog](001-catalog.md). Each TODO must have a
consistently formatted `forEntityRef`, and the todo backend must be able to list
records for one Component.

The example also assumes that the app has a permission backend and a policy
module as described in [Getting started with permissions](../../../permissions/getting-started.md).

You will:

1. Give the read operation the name `todo.read`.
2. Create a rule that recognizes TODOs connected to an allowed Component.
3. Register that rule with the todo backend.
4. Apply the rule whenever the backend returns TODOs.
5. Tell the app that users may read TODOs for Components their Groups own.
6. Apply the same ownership check when users create TODOs.
7. Test the result with an owner and a non-owner.

Install the permission packages:

```shell
yarn workspace @internal/plugin-todo-common add @backstage/plugin-permission-common
yarn workspace @internal/plugin-todo-backend add @backstage/plugin-permission-common @backstage/plugin-permission-node
```

### Step 1: Define the permission

Create the shared permission definition:

```ts title="plugins/todo-common/src/permissions.ts"
import { createPermission } from '@backstage/plugin-permission-common';

export const TODO_RESOURCE_TYPE = 'todo-item';

export const todoReadPermission = createPermission({
  name: 'todo.read',
  attributes: { action: 'read' },
  resourceType: TODO_RESOURCE_TYPE,
});

export const todoPermissions = [todoReadPermission];
```

Export it from the common package:

```ts title="plugins/todo-common/src/index.ts"
export * from './permissions';
```

The `createdBy` field still records who created a TODO, but it does not grant
access. A user may read a TODO only when their Group owns the Component named by
`todo.forEntityRef`.

### Step 2: Define the Component rule

The app policy will produce a list of Components the current user may access.
This [rule](../../../permissions/concepts.md#resources-and-rules) checks whether
a TODO's `forEntityRef` appears in that list. It can check one TODO in memory or
turn the same check into a database query.

```ts title="plugins/todo-backend/src/rules.ts"
import {
  createPermissionResourceRef,
  createPermissionRule,
} from '@backstage/plugin-permission-node';
import { TODO_RESOURCE_TYPE } from '@internal/plugin-todo-common';
import * as z from 'zod';
import type { TodoItem } from './services/TodoListService';

export type TodoQuery = {
  key: 'for_entity_ref';
  values: string[];
};

export const todoResourceRef = createPermissionResourceRef<
  TodoItem,
  TodoQuery
>().with({
  pluginId: 'todo',
  resourceType: TODO_RESOURCE_TYPE,
});

export const hasEntityRef = createPermissionRule({
  name: 'HAS_ENTITY_REF',
  description: 'Allow TODOs that reference one of the supplied entities',
  resourceRef: todoResourceRef,
  paramsSchema: z.object({
    entityRefs: z.array(z.string()).describe('Allowed Catalog entity refs'),
  }),
  apply(todo, { entityRefs }) {
    return entityRefs.includes(todo.forEntityRef);
  },
  toQuery({ entityRefs }) {
    return { key: 'for_entity_ref', values: entityRefs };
  },
});

export const rules = { hasEntityRef };
```

`apply` checks one TODO that has already been loaded. `toQuery` creates the
equivalent database filter when the backend is loading a list of TODOs. Both
must allow the same records.

### Step 3: Register TODOs with the permission framework

In permission terminology, a [**resource**](../../../permissions/concepts.md#resources-and-rules) is the item being protected. Register
TODOs as a resource type, along with the permission, rule, and function that
loads a TODO by id:

```ts title="plugins/todo-backend/src/plugin.ts"
import { todoReadPermission } from '@internal/plugin-todo-common';
import { todoResourceRef, rules } from './rules';

// Inside the plugin init function:
permissionsRegistry.addResourceType({
  resourceRef: todoResourceRef,
  permissions: [todoReadPermission],
  rules: Object.values(rules),
  getResources: async resourceRefs =>
    Promise.all(
      resourceRefs.map(ref =>
        todoList.getTodo({ id: ref }).catch(() => undefined),
      ),
    ),
});
```

Add `coreServices.permissions` and `coreServices.permissionsRegistry` to the
plugin's initialization dependencies and pass both services to `createRouter`.
This registration tells the permission framework how to load a TODO when it
needs to check one specific record.

Create helpers that let the app policy use the `hasEntityRef` rule:

```ts title="plugins/todo-backend/src/conditionExports.ts"
import { createConditionExports } from '@backstage/plugin-permission-node';
import { todoResourceRef, rules } from './rules';

const { conditions, createConditionalDecision } = createConditionExports({
  resourceRef: todoResourceRef,
  rules,
});

export const todoConditions = conditions;
export const createTodoConditionalDecision = createConditionalDecision;
```

Re-export these helpers from `plugins/todo-backend/src/index.ts`.

### Step 4: Apply the permission when returning TODOs

Before a route returns TODOs, ask the permission framework what the signed-in
user may read. The answer may include the Component condition created above:

```ts title="plugins/todo-backend/src/router.ts"
const transformConditions = createConditionTransformer(
  permissionsRegistry.getPermissionRuleset(todoResourceRef),
);

async function getTodoReadFilter(credentials: BackstageCredentials) {
  const decision = (
    await permissions.authorizeConditional(
      [{ permission: todoReadPermission }],
      { credentials },
    )
  )[0];

  if (decision.result === AuthorizeResult.DENY) {
    throw new NotAllowedError();
  }

  return decision.result === AuthorizeResult.CONDITIONAL
    ? transformConditions(decision.conditions)
    : undefined;
}

router.get('/todos/by-entity/:kind/:namespace/:name', async (req, res) => {
  const credentials = await httpAuth.credentials(req, { allow: ['user'] });
  const entity = await catalog.getEntityByRef(req.params, { credentials });
  if (!entity) {
    throw new NotFoundError('Entity not found');
  }

  const result = await todoList.listTodosForEntity({
    forEntityRef: stringifyEntityRef(entity),
    filter: await getTodoReadFilter(credentials),
  });
  res.json(result);
});
```

Apply the same filter to the general `GET /todos` route. For
`GET /todos/:id`, pass both the permission and TODO id to `authorize`; the
framework loads the TODO through `getResources` and applies the same condition.

The database query must apply both filters: the Component selected by the page
and the Components allowed by the permission decision. A `TodoQuery` becomes a
Knex `whereIn` clause:

```ts title="plugins/todo-backend/src/services/TodoListService.ts"
async listTodosForEntity(request: {
  forEntityRef: string;
  filter?: PermissionCriteria<TodoQuery>;
}): Promise<{ items: TodoItem[] }> {
  const query = this.#database<TodoDatabaseRow>('todo').where({
    for_entity_ref: request.forEntityRef,
  });

  if (request.filter) {
    this.applyPermissionFilter(query, request.filter);
  }

  const rows = await query.select();
  return { items: rows.map(row => this.fromDatabaseRow(row)) };
}
```

Permission conditions can be combined with "and," "or," and "not." Use
`isAndCriteria`, `isOrCriteria`, and `isNotCriteria` from
`@backstage/plugin-permission-node` in `applyPermissionFilter` to handle those
combinations. A single `hasEntityRef` condition becomes `whereIn(filter.key,
filter.values)`; a negated condition becomes `whereNotIn`.

### Step 5: Resolve ownership in the app policy

The todo plugin knows how to filter by Component reference, but it does not
decide who owns a Component. The app policy asks the Catalog which Components
are owned by the signed-in user's Groups, then gives that list to the todo
rule.

```ts title="packages/backend/src/extensions/permissionsPolicyExtension.ts"
import {
  coreServices,
  createBackendModule,
  type AuthService,
} from '@backstage/backend-plugin-api';
import { stringifyEntityRef } from '@backstage/catalog-model';
import { catalogServiceRef } from '@backstage/plugin-catalog-node';
import {
  AuthorizeResult,
  isPermission,
  type PolicyDecision,
} from '@backstage/plugin-permission-common';
import {
  PermissionPolicy,
  type PolicyQuery,
  type PolicyQueryUser,
} from '@backstage/plugin-permission-node';
import { policyExtensionPoint } from '@backstage/plugin-permission-node/alpha';
import { todoReadPermission } from '@internal/plugin-todo-common';
import {
  createTodoConditionalDecision,
  todoConditions,
} from '@internal/plugin-todo-backend';

class CatalogOwnerTodoPolicy implements PermissionPolicy {
  constructor(
    private readonly catalog: typeof catalogServiceRef.T,
    private readonly auth: AuthService,
  ) {}

  async handle(
    request: PolicyQuery,
    user?: PolicyQueryUser,
  ): Promise<PolicyDecision> {
    if (isPermission(request.permission, todoReadPermission)) {
      const ownershipEntityRefs = user?.info.ownershipEntityRefs ?? [];
      if (ownershipEntityRefs.length === 0) {
        return { result: AuthorizeResult.DENY };
      }
      const credentials = await this.auth.getOwnServiceCredentials();
      const { items } = await this.catalog.getEntities(
        {
          filter: {
            'relations.ownedBy': ownershipEntityRefs,
          },
        },
        { credentials },
      );

      return createTodoConditionalDecision(
        request.permission,
        todoConditions.hasEntityRef({
          entityRefs: items.map(stringifyEntityRef),
        }),
      );
    }

    return { result: AuthorizeResult.ALLOW };
  }
}

export const permissionsPolicyExtension = createBackendModule({
  pluginId: 'permission',
  moduleId: 'catalog-owner-todos',
  register(reg) {
    reg.registerInit({
      deps: {
        auth: coreServices.auth,
        catalog: catalogServiceRef,
        policy: policyExtensionPoint,
      },
      async init({ auth, catalog, policy }) {
        policy.setPolicy(new CatalogOwnerTodoPolicy(catalog, auth));
      },
    });
  },
});
```

Load the policy module from `packages/backend/src/index.ts`:

```ts
backend.add(import('./extensions/permissionsPolicyExtension'));
```

The policy asks the Catalog for the current owners each time it makes this
decision. If a Component moves to another Group, access changes without
updating any TODO records.

### Step 6: Protect TODO creation

A new TODO does not exist yet, so the app cannot apply `todo.read` to it.
Instead, look up the selected Component first and confirm that the signed-in
user belongs to one of its owning Groups. Only then create the TODO:

```ts title="plugins/todo-backend/src/router.ts"
router.post('/todos', async (req, res) => {
  const parsed = todoSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new InputError(parsed.error.toString());
  }

  const credentials = await httpAuth.credentials(req, { allow: ['user'] });
  const entity = await catalog.getEntityByRef(parsed.data.entityRef, {
    credentials,
  });
  if (!entity) {
    throw new NotFoundError('Entity not found');
  }

  const { ownershipEntityRefs } = await userInfo.getUserInfo(credentials);
  const ownsEntity = (entity.relations ?? []).some(
    relation =>
      relation.type === RELATION_OWNED_BY &&
      ownershipEntityRefs.includes(relation.targetRef),
  );
  if (!ownsEntity) {
    throw new NotAllowedError(
      'Only the owning Group may create TODOs for this entity',
    );
  }

  const result = await todoList.createTodo(parsed.data, { credentials });
  res.status(201).json(result);
});
```

Import `RELATION_OWNED_BY` from `@backstage/catalog-model`, add
`userInfo: coreServices.userInfo` to the plugin dependencies, and pass the
service into `createRouter`.

This check reads ownership from the Component in the Catalog. The TODO continues
to store only `forEntityRef`; it does not store a second copy of the owner.
Other features, such as Scaffolder, must pass along the signed-in user's
identity so this same creation check can protect every entry point.

### Step 7: Verify owner-based access

Use a component whose `ownedBy` relation points to a known Group.

1. Sign in as a member of the owning Group and create a TODO with the
   component's ref.
2. Open the component's **Todos** tab and confirm the TODO appears.
3. Open the same page as a user outside the Group and confirm the TODO does not
   appear.
4. Request the TODO directly as the non-owner and confirm access is denied.
5. Try to create a TODO for the component as the non-owner and confirm the
   request is denied.
6. Change the component to another owning Group and refresh the Catalog entity.
   Confirm the previous owner can no longer read the TODO and a member of the
   new owning Group can.

The last check confirms that creating a TODO does not grant permanent access.
Current Catalog ownership controls both reads and creation.

## Next step

The TODO API now has one authorization contract based on `forEntityRef`. In
[Search](003-search.md), you will reuse `todo.read` so unauthorized TODOs are
removed from search results as well.
