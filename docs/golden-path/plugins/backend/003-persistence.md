---
id: persistence
sidebar_label: 003 - Persisting your TODOs
title: 003 - Persisting your TODOs
description: How to add database persistence to your backend plugin
---

## Saving Plugin State Indefinitely

You may have noticed that your list of TODOs disappears after you restart your Backstage backend. The general flow to restart your backend without having to rerun `yarn start` is to press ENTER on the terminal running `yarn start`. This will force the Backstage backend to restart completely, wiping out any in memory data and starting everything from scratch -- everything except your database.

### Quick intro to SQLite

SQLite is the default database for local development. It runs in memory (and can also run from a file on disk). It supports quick iteration cycles and can be easily deleted if anything goes wrong.

### What does our data look like at rest?

Writing to a database requires a table, which requires us to chat quickly about what we want to store. Our TODO object with `title`, `id`, `createdBy` and `createdAt` keys is a good fit to map 1:1 with our database schema.

## Adding the `databaseService` to your plugin

### The plumbing

To start, let's just plumb through the general `databaseService` usage we expect.

First, add a new service dependency on `databaseService`,

```diff file="src/services/TodoListService.ts"

export const todoListServiceRef = createServiceRef<Expand<TodoListService>>({
  id: 'todo.list',
  defaultFactory: async service =>
    createServiceFactory({
      service,
      deps: {
        logger: coreServices.logger,
        catalog: catalogServiceRef,
+        database: coreServices.database,
      },
      async factory(deps) {
        return TodoListService.create(deps);
      },
    }),
});
```

We then need to add it to our service,

```diff file="src/services/TodoListService.ts"
+import type { Knex } from 'knex';
import {
  coreServices,
  createServiceFactory,
  createServiceRef,
  LoggerService,
+ DatabaseService,
} from '@backstage/backend-plugin-api';

export class TodoListService {
+  readonly #database: Knex;

-  readonly #storedTodos = new Array<TodoItem>();

-  static create(options: {
+  static async create(options: {
    logger: LoggerService;
    catalog: typeof catalogServiceRef.T;
+    database: DatabaseService;
  }) {
     const knex = await options.database.getClient();
-    return new TodoListService(options.logger, options.catalog);
+    return new TodoListService(options.logger, options.catalog, knex);
  }

  private constructor(
    logger: LoggerService,
    catalog: typeof catalogServiceRef.T,
+    database: Knex,
  ) {
    this.#logger = logger;
    this.#catalog = catalog;
+    this.#database = database;
  }
```

And with that, we have an isolated `knex` client to communicate with our database!

### Creating your table

Unfortunately, without tables in our database, our `knex` client is not doing much. We need to create a _migration_. Knex stores migrations as JavaScript/TypeScript files that get executed as part of a call to `knex.migrate.latest()`. By default, these are stored in a `migrations/` directory.

Let's get started. First, we need to install `knex` as a dependency so both its CLI and imported `Knex` types are available,

```bash
yarn workspace @internal/plugin-todo-backend add knex
```

Now, running this command will scaffold a file in that `migrations/` directory for us.

```bash
yarn workspace @internal/plugin-todo-backend knex migrate:make init --migrations-directory ./migrations
```

This should spit out a message like

```bash
Created Migration: ~/Projects/backstage/backstage/plugins/todo-backend/migrations/20260323130057_init.js
```

Let's open that file,

```js
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function up(knex) {
  // await knex.schema...
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function down(knex) {
  // await knex.schema...
};
```

You can see two functions, `up` and `down`. `up` is called to apply a migration and `down` is used to undo a previous migration. These should be reversible - if you call `up` and then `down` the database should generally be in the same state if those commands hadn't been run.

Let's create our table,

```diff
exports.up = async function up(knex) {
+  await knex.schema.createTable('todo', table => {
+    table.uuid('id').primary();
+    table.string('created_by', 255).notNullable();
+    table.string('title').notNullable();
+    table.datetime('created_at').defaultTo(knex.fn.now()).notNullable();

+    table.index(['created_by'], 'todo_user_idx');
  });
};
```

You'll notice that we use `snake_case` instead of `camelCase` - that's how SQL is conventionally written.

Let's make sure that we don't forget to add a `down` migration as well!

```diff
/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
+  await knex.schema.dropTable('todo');
};
```

Now, we need to actually tell our `knex` client to automatically apply these migrations. We'll add the `database` service to our plugin's `init` function,

```diff file="src/plugin.ts"
import {
  coreServices,
  createBackendPlugin,
+  resolvePackagePath,
} from '@backstage/backend-plugin-api';

// ...

      deps: {
        httpAuth: coreServices.httpAuth,
        httpRouter: coreServices.httpRouter,
+        logger: coreServices.logger,
+        database: coreServices.database,
        todoList: todoListServiceRef,
      },
-      async init({ httpAuth, httpRouter, todoList }) {
+      async init({ httpAuth, logger, httpRouter, database, todoList }) {
+        const knex = await database.getClient();
+
+        if (!database.migrations?.skip) {
+          logger.info('Running database migrations...');
+
+          const migrationsDir = resolvePackagePath(
+            '@internal/plugin-todo-backend',
+            'migrations',
+          );
+
+          await knex.migrate.latest({
+            directory: migrationsDir,
+          });
+        }

        httpRouter.use(
          await createRouter({
            httpAuth,
            todoList,
          }),
        );
```

Walking through what we've written -

1. `database.migrations?.skip` - convention for migrations to allow them to be skipped through config.
1. `const migrationsDir = resolvePackagePath` - ensure the correct migrations directory is passed regardless of environment.
1. `await knex.migrate.latest(` - actually run the migration, calls our `up` method we wrote above.

We also need to do 1 more thing,

```diff file="package.json"
"files": [
-    "dist"
+    "dist",
+    "migrations"
  ],
```

This will make sure the migrations in our plugin work for all users.

For those who want more details, the full [Knex migration docs](https://knexjs.org/guide/migrations.html#migration-cli) are very informative!

### Defining our types

Now that we have our table, we need to add types for it to protect against runtime incompatibilities. For now, these are hand written.

```diff title="src/services/TodoListService.ts"
+export interface TodoDatabaseRow {
+  title: string;
+  id: string;
+  created_by: string;
+  created_at: string;
+}

export interface TodoItem {
  title: string;
  id: string;
  createdBy: string;
  createdAt: string;
}
```

Notice the change to snake case as it has to match the database schema we have above. Now we need to transform `TodoItem` to `TodoDatabaseRow` for writes and `TodoDatabaseRow` to `TodoItem` for reads.

```diff title="src/services/TodoListService.ts"
  private constructor(
    logger: LoggerService,
    catalog: typeof catalogServiceRef.T,
+    database: Knex,
  ) {
    this.#logger = logger;
    this.#catalog = catalog;
+    this.#database = database;
  }

+  private toDatabaseRow(todo: TodoItem): TodoDatabaseRow {
+    return {
+      id: todo.id,
+      title: todo.title,
+      created_by: todo.createdBy,
+      created_at: todo.createdAt,
+    };
+  }

+  private fromDatabaseRow(row: TodoDatabaseRow): TodoItem {
+    return {
+      id: row.id,
+      title: row.title,
+      createdBy: row.created_by,
+      createdAt: row.created_at,
+    };
+  }
```

And that's it! You're now set up to actually read from and write to your database.

### Writing to your table

Creating your table was a solid chunk of work - thankfully, writing to it is going to be much easier!

```diff title="src/services/TodoListService.ts"

  async createTodo(
    // ...
    const id = crypto.randomUUID();
    const createdBy = options.credentials.principal.userEntityRef;
    const newTodo = {
      title,
      id,
      createdBy,
      createdAt: new Date().toISOString(),
    };

-    this.#storedTodos.push(newTodo);
+    await this.#database
+      .insert(this.toDatabaseRow(newTodo))
+      .into('todo');

    return newTodo;
  }
```

We've basically just updated our service call to use `this.#database` instead of `this.#storedTodos`.

### Reading from your table

Now that we have things in our database, how do we actually get them back out again?

```diff title="src/services/TodoListService.ts"

  async listTodos(): Promise<{ items: TodoItem[] }> {
-    return { items: Array.from(this.#storedTodos) };
+    const rows = await this.#database('todo').select();
+    return { items: rows.map(row => this.fromDatabaseRow(row)) };
  }

  async getTodo(request: { id: string }): Promise<TodoItem> {
-    const todo = this.#storedTodos.find(item => item.id === request.id);
+    const item = await this.#database('todo').where({ id: request.id }).first();
-    if (!todo) {
+    if (!item) {
      throw new NotFoundError(`No todo found with id '${request.id}'`);
    }
-    return todo;
+    return this.fromDatabaseRow(item);
  }
```

And we're done!

## Testing your changes

To validate this flow, let's use the same commands that we ran in [the last section of this guide](./002-poking-around.md#testing-locally).

If everything is working correctly, you will see the same response that you did last time.
