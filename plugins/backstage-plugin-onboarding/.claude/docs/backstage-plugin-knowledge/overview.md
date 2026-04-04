---

# Backstage Plugin Development Skill

> Complete guide to building Backstage plugins — from scaffold to production.
> Distills patterns from **backstage/backstage** (core), **backstage/community-plugins** (70+ plugins),
> **RoadieHQ/roadie-backstage-plugins** (40+ plugins), and **K-Phoen/backstage-plugin-opsgenie**.

## Table of Contents

1. Quick Orientation & Repository Map
2. Plugin Types — Deciding What to Build
3. Naming Conventions (ADR-011)
4. Frontend Plugins (New System)
5. Backend Plugins (New System)
6. External API Integration Patterns
7. Proxy Configuration
8. App-Config Patterns
9. Community-Plugins Workspace Layout
10. Step-by-Step: Build Your Own Plugin
11. Common Gotchas & Debugging
12. Reference Files

---

## 1. Quick Orientation & Repository Map

| Repository | Scope | Package prefix | Structure |
|---|---|---|---|
| `backstage/backstage` | Core + Spotify-maintained | `@backstage/` | `packages/`, `plugins/` |
| `backstage/community-plugins` | Community workspace monorepo | `@backstage-community/` | `workspaces/<n>/` |
| `RoadieHQ/roadie-backstage-plugins` | Roadie's plugin suite | `@roadiehq/` | `plugins/` |
| Standalone repos (e.g. opsgenie) | Independent plugins | Custom | Standard npm package |

For your own plugins: model after community-plugins workspace structure if contributing upstream, or use a standalone repo if building private plugins.

---

## 2. Plugin Types — Deciding What to Build

| What you want | Package type | Real-world example |
|---|---|---|
| UI page or dashboard | Frontend plugin | OpsGenie alert list page |
| Card on entity page | Frontend (EntityCardBlueprint) | Roadie GitHub PR card |
| Tab on entity page | Frontend (EntityContentBlueprint) | Linguist language breakdown |
| REST API or data layer | Backend plugin | OpsGenie backend API proxy |
| Ingest entities from external source | Backend module (catalog) | GitHub org entity provider |
| Transform/validate entities | Backend module (processor) | Custom annotation validator |
| Template action (scaffolder) | Backend module (scaffolder) | "Create OpsGenie service" |
| Shared types between FE & BE | Common library | `plugin-<id>-common` |
| Extension point for others | Node library | `plugin-<id>-node` |

**Typical multi-package plugin (OpsGenie pattern):**
```
plugin-opsgenie/           # Frontend: alert list, on-call widget, entity cards
plugin-opsgenie-backend/   # Backend: proxy to OpsGenie API, caching, auth
plugin-opsgenie-common/    # Shared types: Alert, OnCall, Schedule interfaces
```

---

## 3. Naming Conventions (ADR-011)

| Package role | npm name pattern | Exported variable |
|---|---|---|
| Frontend plugin | `@backstage-community/plugin-<id>` | `<id>Plugin` |
| Backend plugin | `@backstage-community/plugin-<id>-backend` | `<id>BackendPlugin` |
| Backend module | `@backstage-community/plugin-<host>-backend-module-<mod>` | `catalogModule<Mod>` |
| Node/shared lib | `@backstage-community/plugin-<id>-node` | — |
| React component lib | `@backstage-community/plugin-<id>-react` | — |
| Common types | `@backstage-community/plugin-<id>-common` | — |

Plugin IDs are lowercase dash-separated. For standalone/private plugins, use your own scope: `@mycompany/backstage-plugin-<id>`.

---

## 4. Frontend Plugins (New System)

See `references/frontend.md` for full code examples and extension blueprint catalogue.

### Key entry points

```ts
// src/index.ts — must be the default export
export { myPlugin as default } from './plugin';

// src/plugin.ts
import { createFrontendPlugin } from '@backstage/frontend-plugin-api';

export const myPlugin = createFrontendPlugin({
  pluginId: 'my-plugin',
  info: { packageJson: () => import('../package.json') },
  extensions: [MyPage, MyNavItem, MyEntityCard, MyApi],
});
```

### Extension Blueprints

| Blueprint | Import | Use for |
|---|---|---|
| `PageBlueprint` | `@backstage/frontend-plugin-api` | Standalone routed pages |
| `NavItemBlueprint` | `@backstage/frontend-plugin-api` | Sidebar nav entries |
| `EntityCardBlueprint` | `@backstage/plugin-catalog-react/alpha` | Cards on entity pages |
| `EntityContentBlueprint` | `@backstage/plugin-catalog-react/alpha` | Tabs on entity pages |
| `SearchResultItemBlueprint` | `@backstage/plugin-search-react/alpha` | Search result rows |
| `ApiBlueprint` | `@backstage/frontend-plugin-api` | Utility APIs |

### Utility APIs & Routes

```ts
export const myApiRef = createApiRef<MyApi>({ id: 'plugin.my-plugin.api' });
export const rootRouteRef = createRouteRef();
export const catalogIndexRouteRef = createExternalRouteRef();
```

---

## 5. Backend Plugins (New System)

See `references/backend.md` for full examples.

### Backend plugin skeleton

```ts
import { createBackendPlugin, coreServices } from '@backstage/backend-plugin-api';

export const myPlugin = createBackendPlugin({
  pluginId: 'my-plugin',
  register(env) {
    env.registerInit({
      deps: {
        logger: coreServices.logger, config: coreServices.rootConfig,
        httpRouter: coreServices.httpRouter, database: coreServices.database,
      },
      async init({ logger, httpRouter }) {
        httpRouter.use(await createRouter({ logger }));
      },
    });
  },
});
export default myPlugin;
```

### Backend modules

```ts
import { createBackendModule } from '@backstage/backend-plugin-api';
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node';

export const catalogModuleMyProcessor = createBackendModule({
  pluginId: 'catalog', moduleId: 'my-processor',
  register(env) {
    env.registerInit({
      deps: { catalog: catalogProcessingExtensionPoint },
      async init({ catalog }) { catalog.addProcessor(new MyProcessor()); },
    });
  },
});
export default catalogModuleMyProcessor;
```

### Core services

| Service | What it gives you |
|---|---|
| `coreServices.logger` | Scoped logger |
| `coreServices.rootConfig` | `app-config.yaml` access |
| `coreServices.database` | Knex database client |
| `coreServices.httpRouter` | Express router mount |
| `coreServices.auth` | Service-to-service auth tokens |
| `coreServices.httpAuth` | Validating incoming HTTP credentials |
| `coreServices.userInfo` | User identity from requests |
| `coreServices.scheduler` | Background task scheduling |
| `coreServices.cache` | Key-value cache |
| `coreServices.discovery` | Resolving plugin base URLs |

---

## 6. External API Integration Patterns

See `references/external-api-integration.md` for full patterns.

Architecture (3-tier, proven in OpsGenie/Roadie/PagerDuty plugins):

```
Frontend (React) ──→ Backend Plugin (Express) ──→ External API
 uses fetchApi          auth + caching              OpsGenie/GH/etc.
 + discoveryApi         rate limiting
```

### Backend: External API client (OpsGenie pattern)

```ts
export class ExternalServiceClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(opts: { config: Config; logger: LoggerService }) {
    const cfg = opts.config.getConfig('myPlugin');
    this.apiKey = cfg.getString('apiKey');
    this.baseUrl = cfg.getOptionalString('baseUrl') ?? 'https://api.external.com/v2';
  }

  async getAlerts(query?: string): Promise<Alert[]> {
    const url = new URL(`${this.baseUrl}/alerts`);
    if (query) url.searchParams.set('query', query);
    const response = await fetch(url.toString(), {
      headers: { Authorization: `GenieKey ${this.apiKey}` },
    });
    if (!response.ok) throw new Error(`External API: ${response.status}`);
    return (await response.json()).data;
  }
}
```

### Frontend: API client calling your backend

```ts
export class MyApiClient implements MyApi {
  constructor(private readonly opts: { discoveryApi: DiscoveryApi; fetchApi: FetchApi }) {}

  async getAlerts(query?: string): Promise<Alert[]> {
    const baseUrl = await this.opts.discoveryApi.getBaseUrl('my-plugin');
    const url = new URL(`${baseUrl}/alerts`);
    if (query) url.searchParams.set('query', query);
    const response = await this.opts.fetchApi.fetch(url.toString());
    if (!response.ok) throw new Error(`Request failed: ${response.status}`);
    return response.json();
  }
}
```

---

## 7. Proxy Configuration

For simpler integrations, use Backstage's built-in proxy instead of a full backend plugin.

```yaml
# app-config.yaml
proxy:
  endpoints:
    '/opsgenie':
      target: 'https://api.opsgenie.com/v2'
      headers:
        Authorization: 'GenieKey ${OPSGENIE_API_KEY}'
    '/my-service':
      target: 'https://my-internal-service.example.com'
      changeOrigin: true
```

```ts
// Frontend usage
const proxyUrl = await discoveryApi.getBaseUrl('proxy');
const response = await fetchApi.fetch(`${proxyUrl}/opsgenie/alerts`);
```

**Proxy vs full backend plugin:**
- Proxy: simple read-only, prototyping, <4 endpoints
- Full backend: complex logic, caching, DB, many endpoints, background tasks

---

## 8. App-Config Patterns

```yaml
myPlugin:
  apiKey: ${MY_PLUGIN_API_KEY}          # required secret
  baseUrl: https://api.external.com/v2  # optional override
  ui:
    title: 'My Dashboard'
    pageSize: 25
```

```ts
// Backend reading
const cfg = config.getConfig('myPlugin');
const apiKey = cfg.getString('apiKey');                          // throws if missing
const baseUrl = cfg.getOptionalString('baseUrl') ?? 'default';  // optional with fallback

// Frontend reading (via configApi)
const config = useApi(configApiRef);
const title = config.getOptionalString('myPlugin.ui.title') ?? 'Default';
```

Create `config.d.ts` for type-safe config with `@visibility backend` to keep secrets server-side.

---

## 9. Community-Plugins Workspace Layout

```
workspaces/my-plugin/
  plugins/
    my-plugin/                   # frontend
      src/
        plugin.ts, index.ts, routes.ts, api.ts
        components/              # AlertsList/, OnCallCard/, etc.
        hooks/                   # useAlerts.ts
        types.ts
      dev/index.tsx              # standalone dev runner
      package.json
    my-plugin-backend/           # backend
      src/
        plugin.ts, router.ts, index.ts
        service/external-api-client.ts
      migrations/
      dev/index.ts
      package.json
    my-plugin-common/            # shared types (optional)
  package.json                   # workspace root
  README.md
```

### Key workspace commands

```bash
yarn create-workspace    # from community-plugins root
yarn new                 # from workspace root — create package
yarn start               # from plugin dir — dev server
yarn build:all           # from workspace root
yarn changeset           # before PR
yarn build:api-reports   # update .api.md files
```

---

## 10. Step-by-Step: Build Your Own Plugin

1. **Scaffold** — `yarn create-workspace` (community) or `yarn new` (standalone app)
2. **Define shared types** — Create `-common` package with API interfaces
3. **Build backend** — External API client → Express router → `createBackendPlugin` → config.d.ts
4. **Build frontend** — API ref + client → Components (InfoCard/Table/useAsync) → Blueprints → plugin.ts
5. **Entity annotations** — Define annotation constant, use `useEntity()`, add `MissingAnnotationEmptyState`
6. **Register in app** — `backend.add(import(...))` + app-config.yaml
7. **Test** — `renderInTestApp`/`TestApiProvider` (FE), `startTestBackend`/`supertest` (BE)

---

## 11. Common Gotchas & Debugging

- **Cannot find @backstage/...** → Check `backstage.role` in package.json, run `yarn install` from workspace root
- **401 from backend** → Use `fetchApi` (auto-attaches auth), not raw `fetch`. Backend: `httpAuth.credentials(req)`
- **Entity card missing** → Check `filter` expression matches entity kind. Use `has:annotation/x` for annotation deps
- **Config not found** → Key must match exactly: `app-config.yaml` ↔ `config.getString('myPlugin.apiKey')`
- **Proxy 404** → Proxy paths are at `/api/proxy/<endpoint>/path`. Don't double-prefix
- **API report CI fail** → Run `yarn build:api-reports`, commit the `.api.md` files
- **Backend not loading** → Must have `export default myPlugin` from `src/index.ts`
- **Missing annotation** → Add to entity `catalog-info.yaml`: `my-company.com/my-plugin-id: 'value'`
- **"backstage.role" missing** → Run `yarn backstage-cli repo fix --publish`

---

## 12. Reference Files

Read the relevant reference file before writing complex plugin code:

- `references/frontend.md` — Full frontend extension examples, legacy system, component patterns, dev runner
- `references/backend.md` — Backend services, HTTP routing, DB migrations, scheduler, service-to-service auth
- `references/catalog-integration.md` — Entity providers, processors, custom kinds, scaffolder actions, search collators
- `references/external-api-integration.md` — Deep patterns from OpsGenie, Roadie GitHub, PagerDuty plugins
- `references/real-world-examples.md` — Annotated architecture of real community plugins to model after
