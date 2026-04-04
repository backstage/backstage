# Backend Plugin Reference

## Full Plugin with HTTP Router + Database

```ts
// src/plugin.ts
import { createBackendPlugin, coreServices } from '@backstage/backend-plugin-api';
import { createRouter } from './router';

export const myPlugin = createBackendPlugin({
  pluginId: 'my-plugin',
  register(env) {
    env.registerInit({
      deps: {
        logger:     coreServices.logger,
        config:     coreServices.rootConfig,
        database:   coreServices.database,
        httpRouter: coreServices.httpRouter,
        auth:       coreServices.auth,
        httpAuth:   coreServices.httpAuth,
        discovery:  coreServices.discovery,
      },
      async init({ logger, config, database, httpRouter, auth, httpAuth }) {
        const db = await database.getClient();
        await db.migrate.latest();       // run knex migrations
        const router = await createRouter({ logger, config, db, auth, httpAuth });
        httpRouter.use(router);
        httpRouter.addAuthPolicy({
          path: '/health',
          allow: 'unauthenticated',
        });
      },
    });
  },
});

export default myPlugin;
```

## Router / Express handler

```ts
// src/router.ts
import express, { Router } from 'express';
import { InputError, NotFoundError } from '@backstage/errors';
import { AuthService, HttpAuthService, LoggerService } from '@backstage/backend-plugin-api';

export async function createRouter(opts: {
  logger: LoggerService;
  auth: AuthService;
  httpAuth: HttpAuthService;
}): Promise<Router> {
  const router = Router();
  router.use(express.json());

  router.get('/health', (_, res) => res.json({ status: 'ok' }));

  router.get('/items/:id', async (req, res) => {
    // Validate incoming credentials
    const credentials = await opts.httpAuth.credentials(req, { allow: ['user', 'service'] });
    // ...fetch and return data
    res.json({ id: req.params.id });
  });

  router.post('/items', async (req, res) => {
    const { name } = req.body;
    if (!name) throw new InputError('name is required');
    // ...create item
    res.status(201).json({ name });
  });

  return router;
}
```

## Database Migrations (Knex)

```ts
// migrations/20240101_000_init.ts
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('my_items', table => {
    table.string('id').primary();
    table.string('name').notNullable();
    table.string('owner').notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('my_items');
}
```

```ts
// src/database.ts — typed DB client wrapper
import { Knex } from 'knex';

export class MyDatabase {
  constructor(private readonly db: Knex) {}

  async getItem(id: string) {
    return this.db('my_items').where({ id }).first();
  }

  async createItem(item: { id: string; name: string; owner: string }) {
    return this.db('my_items').insert(item);
  }
}
```

---

## Extension Points (exposing customisation surface)

```ts
// src/extensionPoint.ts — in your -node package
import { createExtensionPoint } from '@backstage/backend-plugin-api';

export interface MyExtensionPoint {
  addProvider(provider: MyProvider): void;
}

export const myExtensionPoint = createExtensionPoint<MyExtensionPoint>({
  id: 'my-plugin.providers',
});

// src/plugin.ts — register and use the extension point
register(env) {
  const providers: MyProvider[] = [];

  env.registerExtensionPoint(myExtensionPoint, {
    addProvider(p) { providers.push(p); },
  });

  env.registerInit({
    deps: { ... },
    async init({ ... }) {
      // providers array is now populated by modules
      for (const p of providers) { ... }
    },
  });
}
```

---

## Scheduler Pattern

```ts
import { coreServices } from '@backstage/backend-plugin-api';

// in registerInit deps:
scheduler: coreServices.scheduler,

// in init:
await scheduler.scheduleTask({
  id:        'my-plugin:sync',
  frequency: { minutes: 30 },
  timeout:   { minutes: 5 },
  fn: async () => {
    logger.info('Running scheduled sync...');
    await runSync();
  },
});
```

---

## Calling Other Backend Services (service-to-service)

```ts
import { coreServices } from '@backstage/backend-plugin-api';

// deps:
auth:      coreServices.auth,
discovery: coreServices.discovery,

// usage:
const { token } = await auth.getPluginRequestToken({
  onBehalfOf: credentials,       // pass-through user credentials
  targetPluginId: 'catalog',
});

const catalogBaseUrl = await discovery.getBaseUrl('catalog');
const res = await fetch(`${catalogBaseUrl}/entities`, {
  headers: { Authorization: `Bearer ${token}` },
});
```

---

## Dev runner (dev/index.ts)

```ts
import { createBackendModule, createBackendPlugin } from '@backstage/backend-plugin-api';
import { mockServices, startTestBackend } from '@backstage/backend-test-utils';
import { myPlugin } from '../src';

startTestBackend({
  features: [
    myPlugin,
    mockServices.rootConfig.factory({
      data: { 'my-plugin': { apiKey: 'dev-key' } },
    }),
  ],
});
```

---

## Testing with startTestBackend

```ts
import { startTestBackend } from '@backstage/backend-test-utils';
import supertest from 'supertest';
import { myPlugin } from '../src/plugin';

describe('my-plugin', () => {
  it('GET /health returns ok', async () => {
    const { server } = await startTestBackend({ features: [myPlugin] });
    const res = await supertest(server).get('/api/my-plugin/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});
```
