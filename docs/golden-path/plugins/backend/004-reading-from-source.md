---
id: reading-from-source
sidebar_label: 004 - Integrating with SCMs
title: 004 - Git-tracked TODOs
description: How to ingest TODOs from source code repositories into your plugin
---

Problem: Your users have a lot of `// TODO:` comments scattered across their repositories and would love to see them surfaced alongside the TODOs they create manually. Backstage already knows where each component lives — through the `backstage.io/source-location` annotation on catalog entities — so we can fetch the source for any component the user owns and harvest those comments.

To do this we need three things:

1. **Credentials** to talk to the SCM provider (GitHub, GitLab, …).
2. A way to **find** the repositories we care about.
3. A way to **fetch** their contents.

Backstage gives us all three through the `integrations` config and the `urlReader` core service.

## Authenticating

The `urlReader` service uses the `integrations` block of your config to figure out how to authenticate against each SCM. You don't need to write any auth code yourself — once a host is registered there, every call you make through `urlReader` will pick up the right token.

For local development, define the integration in `app-config.local.yaml`. That file is ignored by Git, so you can paste a Personal Access Token straight in without it landing in any committed or shared file:

```yaml title="app-config.local.yaml"
integrations:
  github:
    - host: github.com
      token: ghp_yourPersonalAccessTokenHere
```

A PAT with `repo` scope is enough for private repositories; public-only setups can omit the token entirely.

We deliberately leave the committed `app-config.yaml` alone here. Production deployments often want a [GitHub App](https://backstage.io/docs/integrations/github/github-apps) instead of a PAT — you'll still ship credentials with the app, but they rotate automatically and aren't tied to a single user — and putting the dev shape in the committed file would push a PAT-shaped config onto every environment.

The same pattern works for `gitlab`, `bitbucketCloud`, `bitbucketServer`, and `azure`. See the [integrations reference](https://backstage.io/docs/integrations/) for the full list.

## Querying

Now that we can authenticate, we need to know _which_ repositories to scan. We'll lean on the catalog: when the user asks for their TODOs, we'll look up the components they own and read the `backstage.io/source-location` annotation from each one.

First, plumb the `urlReader` service into `TodoListService` alongside the catalog client we already have:

```diff title="src/services/TodoListService.ts"
 import {
   coreServices,
   createServiceFactory,
   createServiceRef,
   LoggerService,
   DatabaseService,
+  UrlReaderService,
 } from '@backstage/backend-plugin-api';

 export const todoListServiceRef = createServiceRef<Expand<TodoListService>>({
   id: 'todo.list',
   defaultFactory: async service =>
     createServiceFactory({
       service,
       deps: {
         logger: coreServices.logger,
         catalog: catalogServiceRef,
         database: coreServices.database,
+        urlReader: coreServices.urlReader,
+        userInfo: coreServices.userInfo,
       },
       async factory(deps) {
         return TodoListService.create(deps);
       },
     }),
 });
```

Wire `urlReader` and `userInfo` through the constructor the same way you did for `database` in the previous step.

Next, add a method that asks the catalog for the components owned by the calling user, or by any Group the user belongs to, and returns their source locations:

```ts title="src/services/TodoListService.ts"
import {
  getEntitySourceLocation,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import type { BackstageCredentials } from '@backstage/backend-plugin-api';
import type { BackstageUserPrincipal } from '@backstage/backend-plugin-api';

async listOwnedSources(options: {
  // Typed as a user principal; the router already enforces `allow: ['user']`
  // before we get here.
  credentials: BackstageCredentials<BackstageUserPrincipal>;
}): Promise<{ entityRef: string; url: string }[]> {
  // A Component is usually owned by a Group rather than by the user directly,
  // so filter by every ownership reference the user has, not only their own.
  const { ownershipEntityRefs } = await this.#userInfo.getUserInfo(
    options.credentials,
  );

  const { items } = await this.#catalog.getEntities(
    {
      filter: {
        kind: 'Component',
        'relations.ownedBy': ownershipEntityRefs,
      },
      fields: ['kind', 'metadata', 'spec'],
    },
    // Pass the caller's credentials so the catalog enforces authorization —
    // never run catalog reads with anonymous credentials inside a request handler.
    { credentials: options.credentials },
  );

  return items
    .map(entity => {
      try {
        // `getEntitySourceLocation` resolves `backstage.io/source-location`,
        // falling back to `backstage.io/managed-by-location`.
        const { type, target } = getEntitySourceLocation(entity);
        if (type !== 'url') return undefined;
        return {
          entityRef: stringifyEntityRef(entity),
          url: target,
        };
      } catch {
        return undefined;
      }
    })
    .filter((s): s is { entityRef: string; url: string } => Boolean(s));
}
```

## Fetching

`urlReader` exposes three methods — `readUrl`, `readTree`, and `search` — and the right one depends on what you're after:

| Method     | When to use it                                              |
| ---------- | ----------------------------------------------------------- |
| `readUrl`  | You know the exact file path you want.                      |
| `readTree` | You want every file in a directory or repository.           |
| `search`   | You want files matching a glob (this is what we want here). |

We'll use `search` so we only pull source files, not lockfiles or binaries:

```ts title="src/services/TodoListService.ts"
private static readonly TODO_PATTERN =
  /\b(?:TODO|FIXME)(?:\(([^)]*)\))?:?\s*(.*)/;

async syncTodosFromSource(options: {
  credentials: BackstageCredentials<BackstageUserPrincipal>;
}): Promise<{ items: TodoItem[] }> {
  const sources = await this.listOwnedSources(options);
  const discovered: DiscoveredTodo[] = [];

  for (const { entityRef, url } of sources) {
    // `urlReader.search` translates this glob into the right per-provider
    // API call (GitHub Trees, GitLab Repository, etc.) and uses the token
    // from `integrations` — no per-host plumbing required here.
    const { files } = await this.#urlReader.search(
      `${url.replace(/\/$/, '')}/**/*.{ts,tsx,js,jsx,go,py,java}`,
    );

    for (const file of files) {
      const content = (await file.content()).toString('utf8');
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const match = lines[i].match(TodoListService.TODO_PATTERN);
        if (!match) continue;

        const [, author, title] = match;
        discovered.push({
          todo: {
            id: crypto.randomUUID(),
            title: title.trim() || lines[i].trim(),
            createdBy: author?.trim()
              ? `user:default/${author.trim()}`
              : entityRef,
            createdAt: new Date().toISOString(),
          },
          // Remember where the TODO was found so a repeated sync can
          // recognize it.
          source: { entityRef, file: file.url, line: i + 1 },
        });
      }
    }
  }

  // Delegate persistence to `createTodos` so the sync flow doesn't have
  // to know how rows are shaped or how conflicts are resolved. It returns
  // only the TODOs that were actually inserted, so a repeated sync reports
  // just what is new.
  const items = await this.createTodos(discovered);

  return { items };
}
```

If a user owns a repo your backend doesn't have credentials for, the `search` call fails with a clear error rather than silently returning nothing — make sure your `integrations` config covers every host you expect to read from.

## Persisting in bulk

`createTodo` from the previous step already handles a single row. Sync can produce hundreds at once, and we want repeated runs to be idempotent rather than inserting the same TODO again. A TODO found in source is identified by where it lives, so record that location and let the database reject duplicates.

Create a second migration:

```bash
yarn workspace @internal/plugin-todo-backend knex migrate:make add_source_location --migrations-directory ./migrations
```

```js title="migrations/<timestamp>_add_source_location.js"
exports.up = async function up(knex) {
  await knex.schema.alterTable('todo', table => {
    // Null for TODOs created by hand, filled in for TODOs found by sync.
    table.string('entity_ref', 255).nullable();
    table.text('source_file').nullable();
    table.integer('source_line').nullable();

    // Null values never conflict, so manually created TODOs are unaffected.
    table.unique(['entity_ref', 'source_file', 'source_line'], {
      indexName: 'todo_source_location_uniq',
    });
  });
};

exports.down = async function down(knex) {
  await knex.schema.alterTable('todo', table => {
    table.dropUnique(
      ['entity_ref', 'source_file', 'source_line'],
      'todo_source_location_uniq',
    );
    table.dropColumn('entity_ref');
    table.dropColumn('source_file');
    table.dropColumn('source_line');
  });
};
```

Define the shape that sync hands to the persistence method, then add the method:

```ts title="src/services/TodoListService.ts"
interface DiscoveredTodo {
  todo: TodoItem;
  source: { entityRef: string; file: string; line: number };
}

async createTodos(todos: DiscoveredTodo[]): Promise<TodoItem[]> {
  // Knex rejects `.insert([])` on some dialects, and skipping the round-trip
  // is cheaper than handling that error — callers can hand us whatever the
  // sync produced without pre-filtering.
  if (todos.length === 0) return [];

  const rows: TodoDatabaseRow[] = await this.#database('todo')
    .insert(
      todos.map(({ todo, source }) => ({
        ...this.toDatabaseRow(todo),
        entity_ref: source.entityRef,
        source_file: source.file,
        source_line: source.line,
      })),
    )
    // Keep repeated syncs idempotent. A TODO that has not moved conflicts with
    // its existing row and is skipped. A TODO that moves to another line is
    // treated as new; handling that is beyond this integration.
    .onConflict(['entity_ref', 'source_file', 'source_line'])
    .ignore()
    // Skipped rows are not returned, so this is exactly what was inserted.
    .returning('*');

  return rows.map(row => this.fromDatabaseRow(row));
}
```

The `returning('*')` call works on PostgreSQL and SQLite, where a conflicting row skipped by `ignore()` is left out of the result. MySQL doesn't support `returning`, so if you run on MySQL you'll need to query the inserted rows back separately.

Finally, expose the new method through the router so users can trigger a sync:

```diff title="src/router.ts"
+  router.post('/todos/sync', async (req, res) => {
+    const credentials = await httpAuth.credentials(req, { allow: ['user'] });
+    const result = await todoList.syncTodosFromSource({ credentials });
+    res.status(200).json(result);
+  });
```

You can now point your plugin at any component you own, hit `POST /api/todo/todos/sync`, and watch the TODOs appear next to the ones you wrote by hand.
