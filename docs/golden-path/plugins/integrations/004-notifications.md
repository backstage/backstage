---
id: notifications
sidebar_label: 004 - Notifications
title: Integrating with Notifications
description: How to integrate your plugin with Backstage Notifications
---

## Notifications

### What are Backstage Notifications?

[Backstage Notifications](../../../notifications/index.md) is the shared
mechanism for telling a user that something happened. A plugin emits a
notification, the notifications backend stores it and surfaces it in the
in-app inbox, and optional processors fan the same notification out to
external channels like email or Slack. The end user sees a single, unified
inbox no matter which plugin sent the message.

The flow looks like this:

1. Your plugin calls `notificationService.send` with a payload and a set of
   recipients (user entity refs, or `broadcast` for everyone).
2. The notifications backend runs the payload through any registered
   `processOptions` hooks, resolves entity refs into individual users, runs
   the per-recipient `preProcess` hooks, and writes the notification to the
   database.
3. The user sees the notification in the Backstage UI; in parallel,
   `postProcess` hooks deliver it to email, Slack, or whatever else the
   adopter has wired up.

Your plugin's job is to send the notification well. How it is delivered is up
to the adopter and the modules they install.

### Common integration points

Most plugins only ever touch one part of the system:

**Sending notifications** from your backend by depending on
`notificationService` and calling `send` when something interesting happens.
This is the integration point for plugins that produce events.

A smaller number of plugins ship a **notification processor** through
`notificationsProcessingExtensionPoint`. That is for plugins that _deliver_
notifications somewhere (a new channel), not for plugins that produce them.
If your plugin sends todos and reminders, you want the sending path, not a
processor.

## TODO with an alarm

The goal is to let users set a due time on a todo and receive a notification
when the alarm fires. The alarm is just a timestamp; the scheduler service
fires us up to look for due todos, and the notifications service delivers
the message.

### Prerequisites

Before starting this guide, you should have:

- A todo backend plugin with database persistence from [Persistence](../backend/003-persistence.md).
- A `plugins/todo-backend/src/plugin.ts` file where backend services are wired
  into the plugin.
- A `plugins/todo-backend/src/router.ts` file that handles `POST /todos`.
- A `plugins/todo-backend/src/services/TodoListService.ts` file where todo
  fields are mapped to database rows.
- The notifications backend and frontend installed in the app where you test
  notifications.

### Mental model

Your todo plugin does not deliver notifications itself. It sends a notification
request to the notifications service. The notifications backend stores the
message, resolves entity recipients to users, and handles delivery through the
channels installed by the adopter.

For alarms, the todo plugin needs one scheduled task. That task finds todos
whose alarm time has passed, sends one notification for each, and marks each
alarm as fired. The `alarm_fired_at` column is what makes the task safe to run
again without sending the same reminder repeatedly.

You'll do this in three steps:

1. Persist the alarm.
2. Add the notification service to the plugin.
3. Send the notification when an alarm is due.

Install the notifications service package in your backend plugin:

```shell
yarn workspace @internal/plugin-todo-backend add @backstage/plugin-notifications-node
```

### Step 1: Persist the alarm

Store the alarm time on the todo and the user who should be notified:

```js
// plugins/todo-backend/migrations/20260520000000_todo_alarms.js
/**
 * @param {import('knex').Knex} knex
 */
exports.up = async knex => {
  await knex.schema.alterTable('todo', table => {
    table.timestamp('alarm_at').nullable();
    table.string('alarm_user_ref').nullable();
    table.timestamp('alarm_fired_at').nullable();
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async knex => {
  await knex.schema.alterTable('todo', table => {
    table.dropColumn('alarm_at');
    table.dropColumn('alarm_user_ref');
    table.dropColumn('alarm_fired_at');
  });
};
```

`alarm_fired_at` is what stops you from sending the same notification twice
when the scheduled task runs again. Compare against it in your query rather
than tracking state in memory.

Carry the same fields through your service type and row mapping:

```diff title="plugins/todo-backend/src/services/TodoListService.ts"
 export interface TodoItem {
   title: string;
   id: string;
   createdBy: string;
+  alarmAt?: string;
+  alarmUserRef?: string;
+  alarmFiredAt?: string;
   createdAt: string;
 }

 export interface TodoDatabaseRow {
   title: string;
   id: string;
   created_by: string;
+  alarm_at: string | null;
+  alarm_user_ref: string | null;
+  alarm_fired_at: string | null;
   created_at: string;
 }
```

Update `toDatabaseRow` and `fromDatabaseRow` in the same file so
`alarmAt`, `alarmUserRef`, and `alarmFiredAt` are written to and read from the
new columns.

Add service methods for the scheduled task:

```ts title="plugins/todo-backend/src/services/TodoListService.ts"
async findDueAlarms(options: { now: Date }): Promise<TodoItem[]> {
  const rows = await this.#database('todo')
    .whereNotNull('alarm_at')
    .whereNull('alarm_fired_at')
    .where('alarm_at', '<=', options.now.toISOString())
    .select();

  return rows.map(row => this.fromDatabaseRow(row));
}

async markAlarmFired(request: { id: string }): Promise<void> {
  await this.#database('todo')
    .where({ id: request.id })
    .update({ alarm_fired_at: new Date().toISOString() });
}
```

### Step 2: Add the notification service to the plugin

Depend on `notificationService` from `@backstage/plugin-notifications-node`
alongside your other services:

```ts
// plugins/todo-backend/src/plugin.ts
import { notificationService } from '@backstage/plugin-notifications-node';
import { fireDueTodoAlarms } from './alarms/fireDueTodoAlarms';

env.registerInit({
  deps: {
    scheduler: coreServices.scheduler,
    notifications: notificationService,
    todoList: todoListServiceRef,
  },
  async init({ scheduler, notifications, todoList }) {
    await scheduler.scheduleTask({
      id: 'todo-alarm-fanout',
      frequency: { minutes: 1 },
      timeout: { minutes: 1 },
      fn: () => fireDueTodoAlarms({ notifications, todoList }),
    });

    // ...register the rest of the plugin
  },
});
```

A one-minute cadence is fine here; the worst case is a one-minute lag on a
user-set alarm, which is well below what users perceive as missed.

### Step 3: Send the notification when an alarm is due

The task itself queries for todos whose alarm has passed but has not yet
been delivered, sends a notification per todo, and marks them as fired:

```ts
// plugins/todo-backend/src/alarms/fireDueTodoAlarms.ts
import type { NotificationService } from '@backstage/plugin-notifications-node';
import type { todoListServiceRef } from '../services/TodoListService';

export async function fireDueTodoAlarms(opts: {
  notifications: NotificationService;
  todoList: typeof todoListServiceRef.T;
}) {
  const due = await opts.todoList.findDueAlarms({ now: new Date() });

  for (const todo of due) {
    if (!todo.alarmUserRef) {
      continue;
    }

    await opts.notifications.send({
      recipients: { type: 'entity', entityRef: todo.alarmUserRef },
      payload: {
        title: `Reminder: ${todo.title}`,
        description: `Created by ${todo.createdBy}`,
        link: `/todo`,
        severity: 'normal',
        topic: 'todo.alarm',
        scope: `todo.alarm:${todo.id}`,
        icon: 'clock',
      },
    });

    await opts.todoList.markAlarmFired({ id: todo.id });
  }
}
```

Two payload fields deserve attention. `topic` groups related notifications
together so users can mute the whole class — "Todo alarms" — without muting
your whole plugin. `scope`, combined with the same `origin`, causes a
repeated send for the same key to update the existing notification rather
than create a new one; this is what saves a user's inbox when an alarm fires
on a flapping condition.

Wrap the send in a try/catch only if you want the loop to continue on
individual failures. Logging the error and moving on is usually the right
call — a one-minute retry is already built in by the scheduler.

## Create TODOs for other people and notify them

When a user creates a todo on behalf of someone else, that person should
hear about it. The pattern is the same as the alarm above, just triggered
from the create handler and with the recipient pulled off the request.

You'll do this in two steps:

1. Send on create.
2. Let users opt out.

### Step 1: Send on create

Inside the `POST /todos` handler, after the new todo has been written to the
database, send a notification to its owner:

Pass the notification service into the router where your create handler lives:

```diff title="plugins/todo-backend/src/plugin.ts"
 await createRouter({
   httpAuth,
+  notifications,
   todoList,
 })
```

```diff title="plugins/todo-backend/src/router.ts"
+import type { NotificationService } from '@backstage/plugin-notifications-node';

 export async function createRouter({
   httpAuth,
+  notifications,
   todoList,
 }: {
   httpAuth: HttpAuthService;
+  notifications: NotificationService;
   todoList: typeof todoListServiceRef.T;
 }): Promise<express.Router> {
```

Add an optional `owner` field to the create request schema, `TodoItem`,
`TodoDatabaseRow`, and the row mappers. Store it as `owner` in the API shape
and database row, or adjust the names below to match your plugin.

```diff title="plugins/todo-backend/src/router.ts"
 const todoSchema = z.object({
   title: z.string(),
   entityRef: z.string().optional(),
+  owner: z.string().optional(),
 });
```

```diff title="plugins/todo-backend/src/services/TodoListService.ts"
 export interface TodoItem {
   title: string;
   id: string;
   createdBy: string;
+  owner?: string;
   createdAt: string;
 }
```

Add a nullable `owner` column in a migration and include it in
`TodoDatabaseRow`, `toDatabaseRow`, and `fromDatabaseRow` before using
`todo.owner` in the handler below.

```ts
// plugins/todo-backend/src/router.ts
router.post('/todos', async (req, res) => {
  const credentials = await httpAuth.credentials(req, { allow: ['user'] });
  const userRef = credentials.principal.userEntityRef;
  const todo = await todoList.createTodo(parsed.data, { credentials });

  if (todo.owner && todo.owner !== userRef) {
    await notifications.send({
      recipients: {
        type: 'entity',
        entityRef: todo.owner,
        excludeEntityRef: userRef,
      },
      payload: {
        title: `${userRef} assigned you a todo`,
        description: todo.title,
        link: `/todo`,
        severity: 'normal',
        topic: 'todo.assigned',
        scope: `todo.assigned:${todo.id}`,
      },
    });
  }

  res.status(201).json(todo);
});
```

Three things to notice:

- The recipient is an entity ref, not a user. If `todo.owner` is a `Group`,
  the notifications backend resolves it to the underlying user members for
  you — you do not need to walk the catalog yourself.
- `excludeEntityRef` keeps a user from notifying themselves when they create
  a todo with themselves as the owner. It is also the right place to pass
  the requesting user when the recipient is a group that the requester is a
  member of.
- The `scope` includes the todo id, so re-assigning the same todo updates
  the existing notification instead of stacking duplicates in the inbox.

### Step 2: Let users opt out

Users can mute notifications per topic from their user settings. The
`topic` field you set on the payload (`todo.assigned`, `todo.alarm`) is the
key they see in that UI, so pick names that read well to a human, and
document them in your plugin's README. There is nothing else to wire up;
the notifications backend honors the user setting before persisting or
fanning out.
