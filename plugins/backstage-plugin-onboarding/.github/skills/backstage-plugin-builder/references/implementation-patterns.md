# Implementation Patterns Reference

## Frontend Plugin — New System (Preferred)

### Plugin Definition (plugin.ts)

```typescript
import { createFrontendPlugin } from '@backstage/frontend-plugin-api';
import { MyPage, MyNavItem, MyEntityCard, MyApi } from './extensions';

export const myPlugin = createFrontendPlugin({
  pluginId: 'my-plugin',
  info: { packageJson: () => import('../package.json') },
  extensions: [MyPage, MyNavItem, MyEntityCard, MyApi],
});
```

### Page Extension

```typescript
import { PageBlueprint } from '@backstage/frontend-plugin-api';

export const MyPage = PageBlueprint.make({
  params: {
    defaultPath: '/my-plugin',
    loader: () => import('./components/MyPage').then(m => <m.MyPage />),
  },
});
```

### Nav Item Extension

```typescript
import { NavItemBlueprint } from '@backstage/frontend-plugin-api';
import DashboardIcon from '@material-ui/icons/Dashboard';

export const MyNavItem = NavItemBlueprint.make({
  params: {
    title: 'My Plugin',
    icon: DashboardIcon,
    routeRef: rootRouteRef,
  },
});
```

### Entity Card Extension

```typescript
import { EntityCardBlueprint } from '@backstage/plugin-catalog-react/alpha';

export const MyEntityCard = EntityCardBlueprint.make({
  name: 'overview',
  params: {
    filter: 'kind:component',  // Only show for components
    loader: () => import('./components/MyCard').then(m => <m.MyCard />),
  },
});
```

### Entity Content (Tab) Extension

```typescript
import { EntityContentBlueprint } from '@backstage/plugin-catalog-react/alpha';

export const MyEntityContent = EntityContentBlueprint.make({
  name: 'details',
  params: {
    defaultPath: '/my-plugin',
    defaultTitle: 'My Plugin',
    filter: 'kind:component,has:annotation/my-company.com/my-plugin-id',
    loader: () => import('./components/MyTab').then(m => <m.MyTab />),
  },
});
```

### API Extension

```typescript
import { ApiBlueprint, createApiFactory } from '@backstage/frontend-plugin-api';

export const MyApi = ApiBlueprint.make({
  params: {
    factory: createApiFactory({
      api: myApiRef,
      deps: { discoveryApi: discoveryApiRef, fetchApi: fetchApiRef },
      factory: ({ discoveryApi, fetchApi }) =>
        new MyPluginClient({ discoveryApi, fetchApi }),
    }),
  },
});
```

### Entry Point (index.ts) — New System

```typescript
// Default export is the plugin itself
export { myPlugin as default } from './plugin';
// Also export API refs and types for consumers
export { myApiRef } from './api';
export type { MyApi } from './api';
```

### Route & API Refs

```typescript
import { createRouteRef, createExternalRouteRef, createApiRef } from '@backstage/frontend-plugin-api';

export const rootRouteRef = createRouteRef();
export const catalogIndexRouteRef = createExternalRouteRef();

export interface MyPluginApi {
  getItems(): Promise<Item[]>;
}
export const myApiRef = createApiRef<MyPluginApi>({ id: 'plugin.my-plugin.api' });
```

---

## Frontend Plugin — Legacy System

### Legacy Plugin Definition (plugin.ts)

```typescript
import {
  createApiFactory,
  createComponentExtension,
  createPlugin,
  createRoutableExtension,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/core-plugin-api';
import { rootRouteRef } from './routes';
import { myPluginApiRef, MyPluginClient } from './apis';

export const myPlugin = createPlugin({
  id: 'my-plugin',
  apis: [
    createApiFactory({
      api: myPluginApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        fetchApi: fetchApiRef,
      },
      factory: ({ discoveryApi, fetchApi }) =>
        new MyPluginClient({ discoveryApi, fetchApi }),
    }),
  ],
  routes: {
    root: rootRouteRef,
  },
});

// Full page extension (routable)
export const MyPluginPage = myPlugin.provide(
  createRoutableExtension({
    name: 'MyPluginPage',
    component: () =>
      import('./components/MyPage').then(m => m.MyPage),
    mountPoint: rootRouteRef,
  }),
);

// Card/widget extension (non-routable)
export const EntityMyPluginCard = myPlugin.provide(
  createComponentExtension({
    name: 'EntityMyPluginCard',
    component: {
      lazy: () =>
        import('./components/MyCard').then(m => m.MyCard),
    },
  }),
);
```

### Routes (routes.ts)

```typescript
import { createRouteRef } from '@backstage/core-plugin-api';

export const rootRouteRef = createRouteRef({
  id: 'my-plugin',
});
```

### API Definition (apis/MyPluginApi.ts)

```typescript
import { createApiRef } from '@backstage/core-plugin-api';

export interface MyPluginApi {
  getItems(): Promise<Item[]>;
  getItemById(id: string): Promise<Item>;
}

export const myPluginApiRef = createApiRef<MyPluginApi>({
  id: 'plugin.my-plugin.service',
});
```

### API Client (apis/MyPluginClient.ts)

```typescript
import { DiscoveryApi, FetchApi } from '@backstage/core-plugin-api';
import { MyPluginApi } from './MyPluginApi';

export class MyPluginClient implements MyPluginApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly fetchApi: FetchApi;

  constructor(options: { discoveryApi: DiscoveryApi; fetchApi: FetchApi }) {
    this.discoveryApi = options.discoveryApi;
    this.fetchApi = options.fetchApi;
  }

  async getItems(): Promise<Item[]> {
    const baseUrl = await this.discoveryApi.getBaseUrl('my-plugin');
    const response = await this.fetchApi.fetch(`${baseUrl}/items`);
    if (!response.ok) {
      throw new Error(`Failed to fetch items: ${response.statusText}`);
    }
    return response.json();
  }

  async getItemById(id: string): Promise<Item> {
    const baseUrl = await this.discoveryApi.getBaseUrl('my-plugin');
    const response = await this.fetchApi.fetch(
      `${baseUrl}/items/${encodeURIComponent(id)}`,
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch item: ${response.statusText}`);
    }
    return response.json();
  }
}
```

### Entry Point (index.ts)

```typescript
// Public API — only export what consumers need
export { myPlugin, MyPluginPage, EntityMyPluginCard } from './plugin';
export { myPluginApiRef } from './apis';
export type { MyPluginApi } from './apis';
```

---

## Backend Plugin Pattern

### Plugin Definition (service/plugin.ts)

```typescript
import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { createRouter } from './router';

export const myPlugin = createBackendPlugin({
  pluginId: 'my-plugin',
  register(env) {
    env.registerInit({
      deps: {
        logger: coreServices.logger,
        config: coreServices.rootConfig,
        database: coreServices.database,
        httpRouter: coreServices.httpRouter,
        auth: coreServices.auth,
        httpAuth: coreServices.httpAuth,
      },
      async init({ logger, config, database, httpRouter, auth, httpAuth }) {
        const router = await createRouter({
          logger,
          config,
          database,
          auth,
          httpAuth,
        });

        httpRouter.use(router);
        httpRouter.addAuthPolicy({
          path: '/health',
          allow: 'unauthenticated',
        });
      },
    });
  },
});
```

### Router (service/router.ts)

```typescript
import { Router } from 'express';
import {
  AuthService,
  HttpAuthService,
  LoggerService,
  DatabaseService,
} from '@backstage/backend-plugin-api';

export interface RouterOptions {
  logger: LoggerService;
  config: unknown;
  database: DatabaseService;
  auth: AuthService;
  httpAuth: HttpAuthService;
}

export async function createRouter(
  options: RouterOptions,
): Promise<Router> {
  const { logger, database, httpAuth } = options;
  const router = Router();

  const knex = await database.getClient();

  router.get('/health', (_, response) => {
    response.json({ status: 'ok' });
  });

  router.get('/items', async (req, res) => {
    // Authenticate the request
    const credentials = await httpAuth.credentials(req);
    
    const items = await knex('items').select('*');
    res.json({ items });
  });

  return router;
}
```

### Entry Point (index.ts)

```typescript
export { myPlugin as default } from './service/plugin';
```

---

## Backend Module Pattern

### Module Definition (module/module.ts)

```typescript
import { createBackendModule } from '@backstage/backend-plugin-api';
import { coreServices } from '@backstage/backend-plugin-api';
// Import the extension point from the parent plugin's -node package
import { myPluginExtensionPoint } from '@backstage/plugin-my-plugin-node';
import { GithubProvider } from '../providers/GithubProvider';

export const myPluginModuleGithub = createBackendModule({
  pluginId: 'my-plugin',    // Must match parent plugin ID
  moduleId: 'github',
  register(env) {
    env.registerInit({
      deps: {
        config: coreServices.rootConfig,
        logger: coreServices.logger,
        myPlugin: myPluginExtensionPoint,
      },
      async init({ config, logger, myPlugin }) {
        myPlugin.addProvider(
          GithubProvider.fromConfig(config, { logger }),
        );
      },
    });
  },
});
```

### Entry Point (index.ts)

```typescript
export { myPluginModuleGithub as default } from './module';
export { GithubProvider } from './providers/GithubProvider';
```

---

## Extension Point Pattern (node package)

```typescript
// plugin-my-plugin-node/src/extensions.ts
import { createExtensionPoint } from '@backstage/backend-plugin-api';

export interface MyPluginExtensionPoint {
  addProvider(provider: MyProvider): void;
  addProcessor(processor: MyProcessor): void;
}

export const myPluginExtensionPoint =
  createExtensionPoint<MyPluginExtensionPoint>({
    id: 'my-plugin',
  });
```

---

## Config Schema Pattern (config.d.ts)

```typescript
export interface Config {
  myPlugin?: {
    /**
     * Base URL of the external service.
     * @visibility backend
     */
    baseUrl: string;

    /**
     * API key for authentication.
     * @visibility secret
     */
    apiKey?: string;

    /**
     * Whether to enable the dashboard widget.
     * @deepVisibility frontend
     */
    dashboard?: {
      enabled?: boolean;
      refreshInterval?: number;
    };
  };
}
```

Visibility annotations:
- `@visibility backend` — Only available to backend plugins
- `@visibility secret` — Never sent to frontend, masked in logs
- `@deepVisibility frontend` — Available to frontend plugins (all nested fields too)

---

## Wiring Into the App

### Frontend (packages/app/src/App.tsx)

```typescript
import { MyPluginPage } from '@backstage/plugin-my-plugin';

// In routes:
<Route path="/my-plugin" element={<MyPluginPage />} />
```

### Entity Page (packages/app/src/components/catalog/EntityPage.tsx)

```typescript
import { EntityMyPluginCard } from '@backstage/plugin-my-plugin';

// In entity overview:
<Grid item md={6}>
  <EntityMyPluginCard />
</Grid>
```

### Backend (packages/backend/src/index.ts)

```typescript
const backend = createBackend();
backend.add(import('@backstage/plugin-my-plugin-backend'));
backend.add(import('@backstage/plugin-my-plugin-backend-module-github'));
backend.start();
```

### App Config (app-config.yaml)

```yaml
myPlugin:
  baseUrl: https://api.example.com
  apiKey: ${MY_PLUGIN_API_KEY}
  dashboard:
    enabled: true
    refreshInterval: 30
```

---

## Testing Patterns

### Frontend Plugin Test

```typescript
import { myPlugin } from './plugin';

describe('myPlugin', () => {
  it('should export plugin', () => {
    expect(myPlugin).toBeDefined();
    expect(myPlugin.getId()).toBe('my-plugin');
  });
});
```

### Backend Plugin Test

```typescript
import request from 'supertest';
import { startTestBackend } from '@backstage/backend-test-utils';
import myPlugin from './plugin';

describe('myPlugin', () => {
  it('should respond to health check', async () => {
    const { server } = await startTestBackend({
      features: [myPlugin],
    });

    const res = await request(server).get('/api/my-plugin/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});
```

### Backend Module Test

```typescript
import { startTestBackend } from '@backstage/backend-test-utils';
import { myPluginExtensionPoint } from '@backstage/plugin-my-plugin-node';
import myModule from './module';

describe('myPluginModuleGithub', () => {
  it('should register provider via extension point', async () => {
    const addProvider = jest.fn();

    await startTestBackend({
      features: [
        myModule,
        // Mock the extension point
        createBackendModule({
          pluginId: 'my-plugin',
          moduleId: 'test',
          register(env) {
            env.registerExtensionPoint(myPluginExtensionPoint, {
              addProvider,
              addProcessor: jest.fn(),
            });
          },
        }),
      ],
    });

    expect(addProvider).toHaveBeenCalled();
  });
});
```
