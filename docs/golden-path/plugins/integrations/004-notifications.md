---
id: notifications
sidebar_label: 004 - Notifications
title: Integrating with Notifications
description: Send TODO reminders to a Component's current owners
---

## Notifications

### What are Backstage Notifications?

[Backstage Notifications](../../../notifications/index.md#about-notifications)
gives each user an in-app inbox. A backend plugin can ask the Notifications
system to place a message in that inbox.

The plugin chooses the message and its
[recipients](../../../notifications/index.md#about-notifications). A recipient
can be one person or a Group from the Software Catalog. When a plugin sends a
notification to a Group, the Notifications system delivers it to the users who
belong to that Group.

In this guide, the todo plugin sends a reminder when a TODO reaches its due
time. It finds the Component named by `todo.forEntityRef`, reads which Groups
own that Component, and sends the reminder to those Groups:

```text
TODO reaches its due time
  -> find the related Component
  -> find the Groups that own the Component
  -> send the reminder to those Groups
```

The TODO stores the Component reference, but it does not store the Component's
owner or the Group's members. The todo plugin looks up that information when it
sends the reminder. If ownership changes, the next reminder goes to the new
owning Group.

## Sending owner-group reminders

### Prerequisites

Before starting:

- Complete [Search](003-search.md).
- Have a component with an `ownedBy` relation to a Group.
- Install the notifications backend and frontend in the example app.

### What to expect

You will:

1. Add a due time and a "reminder sent" time to each TODO.
2. Let users choose a due time when they create a TODO.
3. Run a [scheduled task](../../../backend-system/core-services/scheduler.md) that finds TODOs whose reminders are due.
4. Ask the Catalog which Groups currently own each TODO's Component.
5. Send a notification to those Groups.
6. Check the reminder in the Backstage inbox.

Install the Notifications service package:

```shell
yarn workspace @internal/plugin-todo-backend add @backstage/plugin-notifications-node
```

### Step 1: Persist reminder state

Add a due time and the time at which the reminder was sent:

```js title="plugins/todo-backend/migrations/<timestamp>_todo_reminders.js"
exports.up = async knex => {
  await knex.schema.alterTable('todo', table => {
    table.timestamp('due_at').nullable().index();
    table.timestamp('reminder_sent_at').nullable();
  });
};

exports.down = async knex => {
  await knex.schema.alterTable('todo', table => {
    table.dropColumn('due_at');
    table.dropColumn('reminder_sent_at');
  });
};
```

Carry the fields through the service and database row types:

```diff title="plugins/todo-backend/src/services/TodoListService.ts"
 export interface TodoItem {
   id: string;
   title: string;
   createdBy: string;
   forEntityRef: string;
+  dueAt?: string;
+  reminderSentAt?: string;
   createdAt: string;
 }

 interface TodoDatabaseRow {
   id: string;
   title: string;
   created_by: string;
   for_entity_ref: string;
+  due_at: string | null;
+  reminder_sent_at: string | null;
   created_at: string;
 }
```

Update `toDatabaseRow` and `fromDatabaseRow` in the same file. Convert database
`null` values to `undefined` in `TodoItem`.

`reminderSentAt` prevents duplicate reminders. It stays empty until
Notifications accepts the reminder, then records when it was sent.

### Step 2: Accept a due time

Extend the create request and service input:

```diff title="plugins/todo-backend/src/router.ts"
 const todoSchema = z.object({
   title: z.string(),
   entityRef: z.string(),
+  dueAt: z.string().datetime().optional(),
 });
```

```diff title="plugins/todo-backend/src/services/TodoListService.ts"
 async createTodo(
   input: {
     title: string;
     entityRef: string;
+    dueAt?: string;
   },
   // ...
 ) {
   // ...
   const newTodo = {
     id,
     title,
     createdBy,
     forEntityRef,
+    dueAt: input.dueAt,
     createdAt: new Date().toISOString(),
   };
```

Add a date and time field to the existing TODO form. Send the selected value in
`dueAt` using the ISO 8601 date-time format, such as
`2026-08-03T15:30:00.000Z`. Show the selected time in `TodoList` so the user can
confirm it before waiting for the reminder.

Add the queries used by the scheduled task:

```ts title="plugins/todo-backend/src/services/TodoListService.ts"
async findDueReminders(options: { now: Date }): Promise<TodoItem[]> {
  const rows = await this.#database<TodoDatabaseRow>('todo')
    .whereNotNull('due_at')
    .whereNull('reminder_sent_at')
    .where('due_at', '<=', options.now.toISOString())
    .select();

  return rows.map(row => this.fromDatabaseRow(row));
}

async markReminderSent(request: { id: string; sentAt: Date }): Promise<void> {
  await this.#database<TodoDatabaseRow>('todo')
    .where({ id: request.id })
    .update({ reminder_sent_at: request.sentAt.toISOString() });
}
```

### Step 3: Add the scheduled task

Depend on the services needed to find current ownership and send the reminder:

```ts title="plugins/todo-backend/src/plugin.ts"
import { notificationService } from '@backstage/plugin-notifications-node';
import { catalogServiceRef } from '@backstage/plugin-catalog-node';
import { fireDueTodoReminders } from './reminders/fireDueTodoReminders';

// Inside env.registerInit:
deps: {
  auth: coreServices.auth,
  catalog: catalogServiceRef,
  logger: coreServices.logger,
  notifications: notificationService,
  scheduler: coreServices.scheduler,
  todoList: todoListServiceRef,
  // ...existing dependencies
},
async init({ auth, catalog, logger, notifications, scheduler, todoList }) {
  await scheduler.scheduleTask({
    id: 'todo-owner-reminders',
    frequency: { minutes: 1 },
    timeout: { minutes: 1 },
    fn: () =>
      fireDueTodoReminders({
        auth,
        catalog,
        logger,
        notifications,
        todoList,
      }),
  });

  // ...register the router
}
```

The one-minute interval makes the walkthrough quick to test. A production app
can run the task less often if reminders do not need to arrive immediately.

### Step 4: Resolve owners and send

Create the scheduled task implementation:

```ts title="plugins/todo-backend/src/reminders/fireDueTodoReminders.ts"
import type { AuthService, LoggerService } from '@backstage/backend-plugin-api';
import { parseEntityRef, RELATION_OWNED_BY } from '@backstage/catalog-model';
import type { CatalogService } from '@backstage/plugin-catalog-node';
import type { NotificationService } from '@backstage/plugin-notifications-node';
import type { todoListServiceRef } from '../services/TodoListService';

export async function fireDueTodoReminders(options: {
  auth: AuthService;
  catalog: CatalogService;
  logger: LoggerService;
  notifications: NotificationService;
  todoList: typeof todoListServiceRef.T;
}) {
  const due = await options.todoList.findDueReminders({ now: new Date() });
  const credentials = await options.auth.getOwnServiceCredentials();

  for (const todo of due) {
    const entity = await options.catalog.getEntityByRef(todo.forEntityRef, {
      credentials,
    });
    if (!entity) {
      options.logger.warn(
        `Skipping TODO reminder because ${todo.forEntityRef} was not found`,
      );
      continue;
    }

    const ownerGroupRefs = (entity.relations ?? [])
      .filter(relation => relation.type === RELATION_OWNED_BY)
      .map(relation => relation.targetRef)
      .filter(
        ref => parseEntityRef(ref).kind.toLocaleLowerCase('en-US') === 'group',
      );

    if (ownerGroupRefs.length === 0) {
      options.logger.warn(
        `Skipping TODO reminder because ${todo.forEntityRef} has no Group owner`,
      );
      continue;
    }

    const { kind, namespace, name } = parseEntityRef(todo.forEntityRef);
    await options.notifications.send({
      recipients: {
        type: 'entity',
        entityRef: ownerGroupRefs,
      },
      payload: {
        title: `TODO reminder: ${todo.title}`,
        description: `Due for ${todo.forEntityRef}`,
        link: `/catalog/${namespace}/${kind}/${name}/todos`,
        severity: 'normal',
        topic: 'todo.reminder',
        scope: `todo.reminder:${todo.id}`,
      },
    });

    await options.todoList.markReminderSent({
      id: todo.id,
      sentAt: new Date(),
    });
  }
}
```

Add `logger: coreServices.logger` to the plugin dependencies and pass it to
`fireDueTodoReminders` along with the other services.

Send the owning Group references directly to Notifications. The todo plugin
does not need to look up each person in those Groups; Notifications does that
work. If several owning Groups contain the same person, that person still
receives the notification only once.

The `scope` value gives this reminder a stable identity. If the scheduled task
tries to send the same reminder again, Notifications updates the existing
notification instead of adding a duplicate to the inbox.

### Step 5: Verify the reminder

1. Sign in as a member of the Group that owns your test component.
2. Create a TODO for that component with a due time one or two minutes in the
   future.
3. Confirm the TODO appears on the component's **Todos** tab and in Search.
4. Wait for the scheduled task, then open the Notifications inbox.
5. Confirm one reminder appears and links back to the component's **Todos** tab.
6. Wait through another scheduled run and confirm no duplicate appears.
7. Sign in as a non-owner and confirm the TODO is not visible through its link.

To verify current ownership, change the component's owner in its descriptor and
refresh the Catalog before creating another due TODO. The next reminder should
go to the new owning Group because no owner ref is stored on the TODO.

### What you did

You added due times to TODOs and a scheduled task that finds reminders when they
become due. Before sending a reminder, the task asks the Catalog which Groups
currently own the Component, then sends one inbox notification that links back
to the Component's **Todos** tab.

Future reminders follow Catalog ownership changes, and repeated runs do not
create duplicate notifications.

## Further reading

This guide covers the common case: sending an in-app notification from a
backend plugin. For email or Slack delivery, notification preferences, and
messages sent by systems outside Backstage, continue with the specialized
[Notifications usage](../../../notifications/usage.md) and
[processor](../../../notifications/processors.md) guides.

Continue to [Scaffolder](005-scaffolder.md) to seed owner-visible onboarding
TODOs from a Software Template.
