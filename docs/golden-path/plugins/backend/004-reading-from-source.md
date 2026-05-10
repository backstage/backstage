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

For local development, define the integration in `app-config.local.yaml`. That file is ignored by Git, so it's the right home for development-only config that you don't want to force on every other environment:

```yaml title="app-config.local.yaml"
integrations:
  github:
    - host: github.com
      token: ${GITHUB_TOKEN}
```

The token itself should still come from an environment variable rather than being pasted into the yaml — set `GITHUB_TOKEN` in a `.env` file (or your shell) so it never lands in any committed or shared file. A Personal Access Token with `repo` scope is enough for private repositories; public-only setups can omit the token entirely.

We deliberately leave the committed `app-config.yaml` alone here. Production deployments often want a [GitHub App](https://backstage.io/docs/integrations/github/github-apps) instead of a PAT — the credentials rotate automatically and aren't tied to a single user — and putting the dev shape in the committed file would push a PAT-shaped config onto every environment.

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
       },
       async factory(deps) {
         return TodoListService.create(deps);
       },
     }),
 });
```

Wire it through the constructor the same way you did for `database` in the previous step.

Next, add a method that asks the catalog for the components owned by the calling user and returns their source locations:

```ts title="src/services/TodoListService.ts"
import { getEntitySourceLocation } from '@backstage/catalog-model';

async listOwnedSources(options: {
  credentials: BackstageCredentials;
}): Promise<{ entityRef: string; url: string }[]> {
  const { items } = await this.#catalog.getEntities(
    {
      filter: {
        kind: 'Component',
        'relations.ownedBy': options.credentials.principal.userEntityRef,
      },
      fields: ['kind', 'metadata', 'spec'],
    },
    { credentials: options.credentials },
  );

  return items
    .map(entity => {
      try {
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

A couple of things to note:

1. `getEntitySourceLocation` returns the URL pointing at the entity's source on the SCM (resolved from `backstage.io/source-location`, falling back to `backstage.io/managed-by-location`).
2. We pass the caller's credentials through to the catalog so authorization is enforced — you should never run catalog reads with anonymous credentials inside a request handler.

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
  credentials: BackstageCredentials;
}): Promise<{ items: TodoItem[] }> {
  const sources = await this.listOwnedSources(options);
  const discovered: TodoItem[] = [];

  for (const { entityRef, url } of sources) {
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
          id: crypto.randomUUID(),
          title: title.trim() || lines[i].trim(),
          createdBy: author?.trim()
            ? `user:default/${author.trim()}`
            : entityRef,
          createdAt: new Date().toISOString(),
        });
      }
    }
  }

  await this.#database('todo')
    .insert(discovered.map(todo => this.toDatabaseRow(todo)))
    .onConflict('id')
    .ignore();

  return { items: discovered };
}
```

A few things worth highlighting:

1. **Globs are scoped to the source URL.** `urlReader.search` translates `https://github.com/org/repo/tree/main/**/*.ts` into the right per-provider API call — you don't need to know whether the backend is the GitHub Trees API or the GitLab Repository API.
2. **Authentication is implicit.** Because `github.com` is configured under `integrations`, the search request goes out with the token your env var resolved to. If a user owns a repo your backend doesn't have credentials for, the call will fail with a clear error rather than silently returning nothing.
3. **`onConflict('id').ignore()`** keeps repeated syncs idempotent. A more sophisticated implementation would key off `(entityRef, file, lineNumber)` so an edit to a TODO in source updates the existing row, but that's beyond what we need to demonstrate the integration.

Finally, expose the new method through the router so users can trigger a sync:

```diff title="src/router.ts"
+  router.post('/todos/sync', async (req, res) => {
+    const credentials = await httpAuth.credentials(req, { allow: ['user'] });
+    const result = await todoList.syncTodosFromSource({ credentials });
+    res.status(200).json(result);
+  });
```

You can now point your plugin at any component you own, hit `POST /api/todo/todos/sync`, and watch the TODOs appear next to the ones you wrote by hand.
