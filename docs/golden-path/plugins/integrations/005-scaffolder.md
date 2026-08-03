---
id: scaffolder
sidebar_label: 005 - Scaffolder
title: Creating TODOs from Software Templates
description: Add onboarding TODOs from a Backstage Software Template
---

## Scaffolder

### What is Backstage Scaffolder?

[Backstage Scaffolder](../../../features/software-templates/index.md) lets users
create or update software by filling in a form in Backstage. The form and the
steps that run afterward are defined in a
[**Software Template**](../../../features/software-templates/index.md).

Each step calls an
[**action**](../../../features/software-templates/writing-custom-actions.md),
which is a backend function that performs one task. For example, an action can
create a repository, write a file, or call another Backstage plugin. The
[custom action guide](../../../features/software-templates/writing-custom-actions.md#streamlining-custom-action-creation-with-backstage-cli)
explains how a backend module adds actions to Scaffolder.

### What to expect

In this guide, you will add a `todo:create` action. A Software Template will use
the action to add onboarding TODOs to an existing Component:

```text
User runs a Software Template
  -> template calls todo:create
  -> todo:create asks the todo backend to create TODOs
  -> TODOs appear in the Component tab, Search, and Notifications
```

The action calls the same todo backend route as the frontend. It does not write
to the TODO database directly. This means the ownership check from the
Permissions chapter still decides whether the user may create the TODOs.

### Prerequisites

Before starting:

- Complete [Notifications](004-notifications.md). The owner-based creation check
  from the Permissions chapter must be working.
- Confirm that `@backstage/plugin-scaffolder-backend` is installed in
  `packages/backend`.
- Choose an existing Component with exactly one owning Group. Sign in as a
  member of that Group when you test the template.

## Creating the Scaffolder action

### Step 1: Create a backend module

Create a module for the Scaffolder plugin:

```shell
yarn new --select backend-plugin-module --option pluginId=scaffolder
```

Name the module `todo` when prompted, then add its dependencies:

```shell
yarn workspace @internal/plugin-scaffolder-backend-module-todo add @backstage/backend-plugin-api @backstage/errors @backstage/plugin-scaffolder-node
```

### Step 2: Implement `todo:create`

The action receives a Component reference and a list of TODO titles. When a
user runs the template, the action passes that user's identity to the todo
backend. The todo backend can then apply the same ownership check used by the
frontend.

The action's `schema` describes the values the template must provide and the
values the action returns. Scaffolder shows this information on the
**Installed actions** page.

```ts title="plugins/scaffolder-backend-module-todo/src/actions/createTodoAction.ts"
import type {
  AuthService,
  DiscoveryService,
} from '@backstage/backend-plugin-api';
import { InputError } from '@backstage/errors';
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';

export function createTodoAction(options: {
  auth: AuthService;
  discovery: DiscoveryService;
}) {
  return createTemplateAction({
    id: 'todo:create',
    description: 'Creates TODOs for a Catalog Component',
    schema: {
      input: z =>
        z.object({
          entityRef: z
            .string()
            .describe('Catalog entity ref that the TODOs concern'),
          items: z
            .array(
              z.object({
                title: z.string(),
                dueAt: z.string().datetime().optional(),
              }),
            )
            .min(1),
        }),
      output: z =>
        z.object({
          ids: z.array(z.string()),
        }),
    },
    async handler(ctx) {
      const baseUrl = await options.discovery.getBaseUrl('todo');
      const { token } = await options.auth.getPluginRequestToken({
        onBehalfOf: await ctx.getInitiatorCredentials(),
        targetPluginId: 'todo',
      });
      const ids: string[] = [];

      for (const item of ctx.input.items) {
        const response = await fetch(`${baseUrl}/todos`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: item.title,
            entityRef: ctx.input.entityRef,
            dueAt: item.dueAt,
          }),
          signal: ctx.signal,
        });

        if (!response.ok) {
          throw new InputError(
            `Failed to create TODO: ${response.status} ${response.statusText}`,
          );
        }

        const todo = await response.json();
        ids.push(todo.id);
      }

      ctx.output('ids', ids);
    },
  });
}
```

The `POST /todos` route must perform the ownership check from the Permissions
chapter. The action sends a request as the user who started the template, not
as an unrestricted backend service. Do not let the Component selected in the
template bypass that check.

### Step 3: Register the action

```ts title="plugins/scaffolder-backend-module-todo/src/module.ts"
import {
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import { scaffolderActionsExtensionPoint } from '@backstage/plugin-scaffolder-node';
import { createTodoAction } from './actions/createTodoAction';

export const scaffolderModuleTodo = createBackendModule({
  pluginId: 'scaffolder',
  moduleId: 'todo',
  register(env) {
    env.registerInit({
      deps: {
        actions: scaffolderActionsExtensionPoint,
        auth: coreServices.auth,
        discovery: coreServices.discovery,
      },
      async init({ actions, auth, discovery }) {
        actions.addActions(createTodoAction({ auth, discovery }));
      },
    });
  },
});
```

Install the module in `packages/backend/src/index.ts`:

```ts
backend.add(import('@internal/plugin-scaffolder-backend-module-todo'));
```

Restart the backend, then open `http://localhost:3000/create/actions`. Search
the **Installed actions** page for `todo:create` and confirm that it shows the
expected input and output.

### Step 4: Create an onboarding template

Use an
[entity picker](../../../features/software-templates/ui-options-examples.md#entitypicker)
to let the user choose an existing Component:

```yaml title="templates/todo-onboarding/template.yaml"
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: todo-onboarding
  title: Add component onboarding TODOs
spec:
  owner: group:default/backstage-admins
  type: service
  parameters:
    - title: Select a component
      required:
        - entityRef
      properties:
        entityRef:
          title: Component
          type: string
          ui:field: EntityPicker
          ui:options:
            catalogFilter:
              kind: Component
  steps:
    - id: createTodos
      name: Create onboarding TODOs
      action: todo:create
      input:
        entityRef: ${{ parameters.entityRef }}
        items:
          - title: Review the component documentation
          - title: Configure production monitoring
  output:
    text:
      - title: Created TODOs
        content: ${{ steps.createTodos.output.ids | join(', ') }}
```

Register the template with the Catalog using the normal Software Template
installation flow.

### Step 5: Verify the workflow

1. Sign in as a member of a component's owning Group.
2. Open **Create**, run **Add component onboarding TODOs**, and select that
   component.
3. Confirm the template task reports the created TODO ids.
4. Open the component's **Todos** tab and confirm both items appear.
5. Search for one of the titles and confirm the result opens that tab.
6. Run the template as a non-owner and confirm the todo backend rejects the
   create request.

If the action succeeds for a non-owner, first check that it sends the identity
of the user who started the template. Then check that `POST /todos` applies the
Component ownership rule from the Permissions chapter.

### What you did

You registered a `todo:create` Scaffolder action and used it from a Software
Template that creates onboarding TODOs for a selected Component. The action
passes along the identity of the user who started the template, so the todo
backend can apply its normal creation check.

Members of the owning Group can run the template, while a non-owner cannot use
the action to bypass the todo plugin's permissions.

## Next step

Continue to [Actions and MCP](006-mcp.md) to expose the same owner-authorized
TODO workflow as MCP tools.
