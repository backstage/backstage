---
name: backstage-plugin-builder
description: >
  Expert knowledge for building Backstage plugins from scratch — covering frontend (createFrontendPlugin,
  extension blueprints, legacy createPlugin), backend (createBackendPlugin, createBackendModule), external
  API integration, proxy config, catalog providers/processors, scaffolder actions, entity cards/pages,
  and real-world patterns from backstage/community-plugins, RoadieHQ/roadie-backstage-plugins, and
  backstage-plugin-opsgenie. Use when: creating a new Backstage plugin, scaffolding plugin workspace,
  building developer portal plugin, extending Backstage catalog, building backend module, creating
  routable extension, designing plugin API surface, publishing plugin to npm, contributing to
  community-plugins, integrating external service APIs, proxy configuration, app-config patterns,
  or debugging any @backstage package.
argument-hint: 'Describe the plugin you want to build (e.g., "frontend plugin for Datadog alerts" or "backend module for GitHub webhooks")'
---

# Backstage Plugin Builder

Build production-quality Backstage plugins following patterns from **backstage/backstage** (core),
**backstage/community-plugins** (70+ plugins), **RoadieHQ/roadie-backstage-plugins** (40+ plugins),
and **K-Phoen/backstage-plugin-opsgenie**.

## When to Use

- Creating a new Backstage frontend plugin (pages, cards, entity tabs)
- Creating a new Backstage backend plugin (APIs, services, processors)
- Creating a backend module that extends an existing plugin
- Integrating an external service (OpsGenie, Datadog, PagerDuty, etc.)
- Creating a common/shared library package for types and constants
- Scaffolding a full plugin workspace (frontend + backend + common)
- Contributing a plugin to `backstage/community-plugins`
- Building catalog providers, processors, or scaffolder actions
- Configuring proxy endpoints or app-config patterns
- Debugging plugin loading, auth, config, or entity annotation issues

## Quick Reference: Repository Map

| Repository | Scope | Package prefix | Structure |
|---|---|---|---|
| `backstage/backstage` | Core + Spotify-maintained | `@backstage/` | `packages/`, `plugins/` |
| `backstage/community-plugins` | Community workspace monorepo | `@backstage-community/` | `workspaces/<n>/` |
| `RoadieHQ/roadie-backstage-plugins` | Roadie's plugin suite | `@roadiehq/` | `plugins/` |
| Standalone repos (e.g. opsgenie) | Independent plugins | Custom | Standard npm package |

## Quick Reference: Plugin Types

| What you want | Package type | Real-world example |
|---|---|---|
| UI page or dashboard | Frontend plugin | OpsGenie alert list page |
| Card on entity page | Frontend (`EntityCardBlueprint`) | Roadie GitHub PR card |
| Tab on entity page | Frontend (`EntityContentBlueprint`) | Linguist language breakdown |
| REST API or data layer | Backend plugin | OpsGenie backend API proxy |
| Ingest entities from external source | Backend module (catalog) | GitHub org entity provider |
| Transform/validate entities | Backend module (processor) | Custom annotation validator |
| Template action (scaffolder) | Backend module (scaffolder) | "Create OpsGenie service" |
| Shared types between FE & BE | Common library | `plugin-<id>-common` |
| Extension point for others | Node library | `plugin-<id>-node` |

## Procedure

### Step 1: Determine Plugin Scope

Ask the user to clarify:

1. **What does the plugin do?** — Integration with an external service? New UI surface? Data processor?
2. **Which packages are needed?**
   - `plugin-{name}` — Frontend UI (pages, cards, components)
   - `plugin-{name}-backend` — Backend service (APIs, routes, processors)
   - `plugin-{name}-common` — Shared types, constants, API refs
   - `plugin-{name}-react` — Shared React components/hooks used by multiple frontend plugins
   - `plugin-{name}-node` — Shared backend utilities used by modules
   - `plugin-{name}-backend-module-{provider}` — Backend module extending a parent plugin
3. **Where will it live?**
   - Inside a Backstage app repo (`plugins/` folder)
   - As a standalone repo (independent npm package)
   - In `backstage/community-plugins` (workspace model)
4. **Does it integrate an external API?** If yes, decide: proxy (simple, <4 endpoints) vs full backend plugin (complex logic, caching, DB, auth)

### Step 2: Scaffold the Plugin

Use the Backstage CLI for initial scaffolding:

```bash
# From repo root — interactive prompt
yarn new

# Or pre-select type
yarn new --select frontend-plugin
yarn new --select backend-plugin
yarn new --select backend-plugin-module
yarn new --select common-library
```

For community-plugins workspace:
```bash
cd community-plugins
yarn install
yarn create-workspace          # Creates workspace with changesets
cd workspaces/{name}
yarn install
yarn new                       # Add plugins inside the workspace
```

### Step 3: Structure the Plugin

Follow the reference architecture in [./references/plugin-architecture.md](./references/plugin-architecture.md).

Key structural rules:
- Every plugin is its own package with `package.json`, `src/`, and `README.md`
- Entry point is always `src/index.ts` — controlled exports, `export default` for backend
- Plugin definition in `src/plugin.ts` (frontend) or `src/service/plugin.ts` (backend)
- Routes in `src/routes.ts`, components in `src/components/`
- Config schema in `config.d.ts` at package root
- Dev environment in `dev/index.ts` or `dev/index.tsx`

### Step 4: Implement the Plugin

Choose the correct system:

**Frontend — New System** (preferred for new plugins):
Use `createFrontendPlugin()` with extension blueprints (`PageBlueprint`, `EntityCardBlueprint`, `EntityContentBlueprint`, `NavItemBlueprint`, `ApiBlueprint`).
See [./references/implementation-patterns.md](./references/implementation-patterns.md) § "Frontend Plugin — New System".

**Frontend — Legacy System** (existing apps not yet migrated):
Use `createPlugin()`, `createRoutableExtension()`, `createComponentExtension()`, `createApiFactory()`.
See [./references/implementation-patterns.md](./references/implementation-patterns.md) § "Frontend Plugin — Legacy System".

**Backend plugins**: Use `createBackendPlugin()`, `env.registerInit()`, `coreServices.*`.
**Backend modules**: Use `createBackendModule()` targeting parent's `pluginId`, extend via extension points.
**Common packages**: Export only types, constants, and API refs — no runtime code.

For external API integration, follow [./references/external-api-integration.md](./references/external-api-integration.md).
For catalog providers/processors/scaffolder actions, follow [./references/catalog-integration.md](./references/catalog-integration.md).

### Step 5: Configure package.json

Follow the patterns in [./references/package-json-patterns.md](./references/package-json-patterns.md).

Critical fields:
- `backstage.role` — Must be one of: `frontend-plugin`, `backend-plugin`, `backend-plugin-module`, `common-library`, `frontend-plugin-module`
- `backstage.pluginId` — The plugin identifier
- `backstage.pluginPackages` — Array of all related packages
- `exports` — Map of public entry points (`.`, `./alpha`, `./package.json`)
- `configSchema` — Reference to `config.d.ts` if plugin has configuration
- `files` — Must include `dist` and `config.d.ts`

### Step 6: Configure app-config.yaml

```yaml
# Backend secrets — use @visibility backend or @visibility secret in config.d.ts
myPlugin:
  apiKey: ${MY_PLUGIN_API_KEY}          # required secret
  baseUrl: https://api.external.com/v2  # optional override

# Frontend-safe config — use @deepVisibility frontend
  ui:
    title: 'My Dashboard'
    pageSize: 25

# Alternative: proxy for simple integrations (< 4 endpoints, read-only)
proxy:
  endpoints:
    '/my-service':
      target: 'https://api.external.com/v2'
      headers:
        Authorization: 'Bearer ${MY_SERVICE_TOKEN}'
      changeOrigin: true
```

Backend reads: `config.getString('myPlugin.apiKey')` — throws if missing.
Frontend reads: `useApi(configApiRef).getOptionalString('myPlugin.ui.title')`.

### Step 7: Write Tests

- **Frontend**: Jest + `renderInTestApp` + `TestApiProvider` from `@backstage/test-utils`
- **Backend**: `startTestBackend()` from `@backstage/backend-test-utils` + `supertest`
- **Integration**: Dev environment in `dev/` folder for manual testing
- Run with `yarn test` (delegates to `backstage-cli package test`)

### Step 8: Document and Publish

- Write `README.md` with: description, installation, configuration, usage examples
- Create `catalog-info.yaml` for self-registration in Backstage catalog
- For community-plugins: `yarn changeset`, `yarn build:api-reports`, submit PR
- For npm: `backstage-cli package build` then publish

## Core Services Reference (Backend)

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
| `coreServices.permissions` | Permission policy checks |
| `coreServices.rootLifecycle` | Startup/shutdown hooks |
| `coreServices.urlReader` | Reading from remote URLs |

## Extension Blueprints Reference (New Frontend System)

| Blueprint | Import | Use for |
|---|---|---|
| `PageBlueprint` | `@backstage/frontend-plugin-api` | Standalone routed pages |
| `NavItemBlueprint` | `@backstage/frontend-plugin-api` | Sidebar nav entries |
| `EntityCardBlueprint` | `@backstage/plugin-catalog-react/alpha` | Cards on entity pages |
| `EntityContentBlueprint` | `@backstage/plugin-catalog-react/alpha` | Tabs on entity pages |
| `SearchResultItemBlueprint` | `@backstage/plugin-search-react/alpha` | Search result rows |
| `ApiBlueprint` | `@backstage/frontend-plugin-api` | Utility APIs |

## Common Gotchas & Debugging

- **Cannot find @backstage/...** — Check `backstage.role` in package.json, run `yarn install` from workspace root
- **401 from backend** — Use `fetchApi` (auto-attaches auth), not raw `fetch`. Backend: `httpAuth.credentials(req)`
- **Entity card missing** — Check `filter` expression matches entity kind. Use `has:annotation/x` for annotation deps
- **Config not found** — Key must match exactly: `app-config.yaml` key ↔ `config.getString('myPlugin.apiKey')`
- **Proxy 404** — Proxy paths are at `/api/proxy/<endpoint>/path`. Don't double-prefix
- **API report CI fail** — Run `yarn build:api-reports`, commit the `.api.md` files
- **Backend not loading** — Must have `export default myPlugin` from `src/index.ts`
- **Missing annotation** — Add to entity `catalog-info.yaml`: `my-company.com/my-plugin-id: 'value'`
- **"backstage.role" missing** — Run `yarn backstage-cli repo fix --publish`

## Quality Checklist

- [ ] Plugin ID follows naming convention (ADR-011: lowercase dash-separated)
- [ ] `backstage.role` is set correctly in package.json
- [ ] `config.d.ts` uses `@deepVisibility frontend` for frontend-safe config, `@visibility secret` for keys
- [ ] All components use lazy loading (`import()`) for code splitting
- [ ] Backend services use dependency injection via `coreServices`
- [ ] Extension points defined (node package) for modules to extend
- [ ] API surface is minimal — only export what consumers need
- [ ] Frontend uses `fetchApi` (not raw `fetch`) for authenticated requests
- [ ] Entity cards check for required annotations with `MissingAnnotationEmptyState`
- [ ] Tests cover plugin initialization and critical paths
- [ ] README includes installation, configuration, and usage sections
- [ ] `catalog-info.yaml` exists for plugin self-registration

## Reference Files

Load the relevant reference before writing complex plugin code:

- [./references/plugin-architecture.md](./references/plugin-architecture.md) — Folder structures, naming conventions, workspace layout
- [./references/implementation-patterns.md](./references/implementation-patterns.md) — Frontend (new + legacy), backend, module, config, test code templates
- [./references/package-json-patterns.md](./references/package-json-patterns.md) — Exact package.json for each package type
- [./references/external-api-integration.md](./references/external-api-integration.md) — 3-tier architecture, backend API clients, proxy vs full backend decision
- [./references/catalog-integration.md](./references/catalog-integration.md) — Entity providers, processors, custom kinds, scaffolder actions, search collators
- [./references/real-world-examples.md](./references/real-world-examples.md) — Annotated architecture of OpsGenie, Roadie GitHub, and PagerDuty plugins
