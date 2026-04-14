---
name: plugin-full-frontend-system-migration
description: Fully migrate a Backstage plugin to the new frontend system, dropping all old system support. Use this skill for internal plugins that only need to run in a single app, or when you are ready to remove backward compatibility entirely.
---

# Full Plugin Migration to the New Frontend System

This skill helps fully migrate an existing Backstage plugin from the old frontend system to the new one. Unlike adding dual support (which keeps the old system working), this is a complete migration that removes all `@backstage/core-plugin-api` usage and makes the plugin work exclusively with the new frontend system.

This is the preferred approach for internal plugins that are only used in a single app, since there is no need to maintain backward compatibility. It can also be used for published plugins when you're ready to drop old system support entirely.

It is highly recommended to be on Backstage version 1.49.x or above before starting this, although not mandatory, you may face issues with some of the instructions below. This can be verified by looking in the `backstage.json` file in the root of the repository.

## Key Differences from Dual Support

| Aspect           | Dual Support                                      | Full Migration                                              |
| ---------------- | ------------------------------------------------- | ----------------------------------------------------------- |
| Entry point      | Old `src/plugin.ts` + new `src/alpha.tsx`         | Single `src/plugin.tsx`                                     |
| Plugin creation  | Both `createPlugin` and `createFrontendPlugin`    | Only `createFrontendPlugin`                                 |
| Core dependency  | Keeps `@backstage/core-plugin-api`                | Removes it, uses only `@backstage/frontend-plugin-api`      |
| Route refs       | Reuses `@backstage/core-plugin-api` refs directly | Uses `createRouteRef` from `@backstage/frontend-plugin-api` |
| Page shell       | Old pages keep `Page`/`Header`, NFS pages skip it | All pages rely on framework's `PageLayout`/`PluginHeader`   |
| Internal routing | May keep legacy `<Route>` trees in components     | Replaced with `SubPageBlueprint` tabbed pages               |
| Compatibility    | Not needed                                        | Not needed                                                  |

## Step 1: Migrate Route Refs

Replace `createRouteRef` / `createSubRouteRef` / `createExternalRouteRef` imports:

```typescript
// OLD (src/routes.ts)
import {
  createRouteRef,
  createSubRouteRef,
  createExternalRouteRef,
} from '@backstage/core-plugin-api';

export const rootRouteRef = createRouteRef({ id: 'my-plugin' });
export const detailsRouteRef = createSubRouteRef({
  id: 'my-plugin-details',
  parent: rootRouteRef,
  path: '/details/:id',
});
export const externalDocsRouteRef = createExternalRouteRef({ id: 'docs' });

// NEW (src/routes.ts)
import {
  createRouteRef,
  createSubRouteRef,
  createExternalRouteRef,
} from '@backstage/frontend-plugin-api';

export const rootRouteRef = createRouteRef();
export const detailsRouteRef = createSubRouteRef({
  path: '/details/:id',
  parent: rootRouteRef,
});
export const externalDocsRouteRef = createExternalRouteRef({
  defaultTarget: 'techdocs.docRoot',
});
```

Key differences:

- `createRouteRef()` no longer takes an `id` — the ID is derived from the extension
- `createSubRouteRef` path must start with `/` and must not end with `/`
- `createExternalRouteRef()` no longer takes an `id` or `optional` flag

### Set Default Targets for External Route Refs

When migrating external route refs, always set `defaultTarget` to the most common binding target. This removes the need for apps to explicitly bind routes via `bindRoutes` for standard plugin combinations:

```typescript
export const createComponentRouteRef = createExternalRouteRef({
  defaultTarget: 'scaffolder.root',
});

export const viewTechDocRouteRef = createExternalRouteRef({
  params: ['namespace', 'kind', 'name'],
  defaultTarget: 'techdocs.docRoot',
});

export const catalogEntityRouteRef = createExternalRouteRef({
  params: ['namespace', 'kind', 'name'],
  defaultTarget: 'catalog.catalogEntity',
});
```

The `defaultTarget` string uses the `<pluginId>.<routeName>` format, where `routeName` matches a key in the target plugin's `routes` map. The default is only activated when the target plugin is installed — otherwise the route stays unbound and `useRouteRef` returns `undefined`.

This is especially important for a full migration because in the old system, apps typically had explicit `bindRoutes` calls. With default targets, most of those bindings become unnecessary, improving the plug-and-play experience.

## Step 2: Migrate the Plugin Definition

Replace `src/plugin.ts` with a `createFrontendPlugin`-based definition:

```tsx
// NEW (src/plugin.tsx)
import { createFrontendPlugin } from '@backstage/frontend-plugin-api';
import { RiToolsLine } from '@remixicon/react';
import { rootRouteRef, externalDocsRouteRef } from './routes';
import { myPage } from './extensions';
import { myPluginApi } from './apis';

export default createFrontendPlugin({
  pluginId: 'my-plugin',
  title: 'My Plugin',
  icon: <RiToolsLine />,
  info: {
    packageJson: () => import('../package.json'),
  },
  routes: {
    root: rootRouteRef,
  },
  externalRoutes: {
    docs: externalDocsRouteRef,
  },
  extensions: [myPluginApi, myPage],
});
```

For the plugin `icon`, prefer using [Remix Icons](https://remixicon.com/) from `@remixicon/react`. If the plugin already has an existing MUI icon, it can be kept with `fontSize="inherit"` (e.g. `<CategoryIcon fontSize="inherit" />`), but for new icons Remix is the recommended choice.

Since this is the only entry point now, export it as default from `src/index.ts` or update `package.json` exports accordingly. If the plugin was previously consumed via its main entry point, you can make the main entry point export the new plugin:

```json
{
  "exports": {
    ".": "./src/index.ts",
    "./package.json": "./package.json"
  }
}
```

```typescript
// src/index.ts
export { default } from './plugin';
export { rootRouteRef } from './routes';
```

## Step 3: Migrate API Factories to `ApiBlueprint`

```typescript
// OLD
import {
  createApiFactory,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/core-plugin-api';

export const myApiFactory = createApiFactory({
  api: myPluginApiRef,
  deps: { discoveryApi: discoveryApiRef, fetchApi: fetchApiRef },
  factory: ({ discoveryApi, fetchApi }) =>
    new MyPluginClient({ discoveryApi, fetchApi }),
});

// NEW (src/apis.ts)
import {
  ApiBlueprint,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/frontend-plugin-api';
import { myPluginApiRef } from './api';

export const myPluginApi = ApiBlueprint.make({
  params: defineParams =>
    defineParams({
      api: myPluginApiRef,
      deps: { discoveryApi: discoveryApiRef, fetchApi: fetchApiRef },
      factory: ({ discoveryApi, fetchApi }) =>
        new MyPluginClient({ discoveryApi, fetchApi }),
    }),
});
```

Also update the API ref creation to the new builder pattern with explicit `pluginId`:

```typescript
// OLD
import { createApiRef } from '@backstage/core-plugin-api';

export const myPluginApiRef = createApiRef<MyPluginApi>({
  id: 'plugin.my-plugin.client',
});

// NEW (recommended builder pattern with explicit pluginId)
import { createApiRef } from '@backstage/frontend-plugin-api';

export const myPluginApiRef = createApiRef<MyPluginApi>().with({
  id: 'plugin.my-plugin.client',
  pluginId: 'my-plugin',
});
```

The builder form (`createApiRef<T>().with(...)`) is preferred because ownership is explicit via `pluginId` rather than parsed from the ID string. The `id` must still be globally unique across the app — the `pluginId` is ownership metadata, not a namespace prefix.

### API Ownership and Override Rules

The new system enforces **API ownership** — only the owning plugin (or a module targeting it) can provide or override a given API. Ownership is determined by:

1. The explicit `pluginId` on the `ApiRef` (if set via the builder pattern)
2. Falling back to inference from the `ApiRef` ID string:
   - `plugin.<pluginId>.*` → owned by that plugin
   - `core.*` → owned by the `app` plugin

If app adopters want to replace your plugin's default API implementation, they must use a `createFrontendModule` with `pluginId` matching your plugin — they cannot override it from a different plugin or from a generic `app` module. This is a stricter model than the old system where any API could be overridden from the app's `apis` array.

## Step 4: Migrate Pages to `PageBlueprint`

### Simple Page (No Sub-Routes)

```tsx
// src/extensions.tsx
import { PageBlueprint } from '@backstage/frontend-plugin-api';
import { rootRouteRef } from './routes';

export const myPage = PageBlueprint.make({
  params: {
    path: '/my-plugin',
    routeRef: rootRouteRef,
    loader: () => import('./components/MyPage').then(m => <m.MyPage />),
  },
});
```

The `MyPage` component should **not** include `Page`, `Header`, or `PageWithHeader` from `@backstage/core-components`. The framework's `PageLayout` renders `PluginHeader` automatically.

The `title` and `icon` params on `PageBlueprint` are only needed if they should differ from the plugin's own `title` and `icon` (set in `createFrontendPlugin`). If omitted, the plugin-level values are used.

### Page with `Header` for Custom Actions

If your page needs a subtitle or action buttons below the framework header, use `Header` from `@backstage/ui`:

```tsx
// src/components/MyPage/MyPage.tsx
import { Header } from '@backstage/ui';
import { Content } from '@backstage/core-components';

export function MyPage() {
  return (
    <>
      <Header
        title="Subtitle or description"
        customActions={
          <>
            <CreateButton title="Create" to="/my-plugin/create" />
            <SupportButton>Help text</SupportButton>
          </>
        }
      />
      <Content>
        <MyPageContent />
      </Content>
    </>
  );
}
```

### Page Without Header

For pages that manage their own layout entirely (e.g. home page, dashboards), set `noHeader: true`:

```tsx
export const myPage = PageBlueprint.make({
  params: {
    path: '/my-plugin',
    routeRef: rootRouteRef,
    noHeader: true,
    loader: () => import('./components/MyPage').then(m => <m.MyPage />),
  },
});
```

## Step 5: Replace Internal Routing with Sub-Pages

Old frontend plugins often use React Router `<Route>` trees inside a router component to handle internal navigation. Before migrating, determine which routing pattern fits the plugin.

### Decide Which Routing Pattern to Use

Not all internal routing maps to tabs. Read the plugin's existing router component and ask the user:

> "Does your plugin use top-level tabs that users navigate between via a header (e.g. Overview / Settings)? Or does it use detail/drill-down routes (e.g. `/my-plugin/items/:id`)?"

Use `SubPageBlueprint` when:

- The sub-routes represent top-level tabs/sections of the plugin
- Users navigate between them via the header

Keep internal routing within a `PageBlueprint` `loader` when:

- Routes are detail/drill-down pages (e.g. `/my-plugin/items/:id`)
- The routing is deeply nested or dynamic

**If the plugin uses drill-down routing only**, use a `PageBlueprint` with a `loader` that handles its own `<Routes>` and skip the rest of this step:

```tsx
export const myPage = PageBlueprint.make({
  params: {
    path: '/my-plugin',
    routeRef: rootRouteRef,
    loader: () => import('./components/Router').then(m => <m.MyPluginRouter />),
  },
});
```

**If the plugin uses top-level tabs**, continue with the `SubPageBlueprint` migration below.

### Old Pattern: Internal Router

```tsx
// OLD — plugin owns its own routing
import { Route, Routes } from 'react-router-dom';

export function MyPluginRouter() {
  return (
    <Page themeId="tool">
      <Header title="My Plugin" />
      <HeaderTabs
        tabs={[
          { id: 'overview', label: 'Overview' },
          { id: 'settings', label: 'Settings' },
        ]}
      />
      <Content>
        <Routes>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Content>
    </Page>
  );
}
```

### New Pattern: `PageBlueprint` + `SubPageBlueprint`

```tsx
// src/extensions.tsx
import {
  PageBlueprint,
  SubPageBlueprint,
} from '@backstage/frontend-plugin-api';

// Parent page WITHOUT a loader — uses built-in tabbed rendering
export const myPluginPage = PageBlueprint.make({
  params: {
    path: '/my-plugin',
    routeRef: rootRouteRef,
  },
});

export const overviewSubPage = SubPageBlueprint.make({
  name: 'overview',
  params: {
    path: 'overview',
    title: 'Overview',
    loader: () =>
      import('./components/OverviewPage').then(m => <m.OverviewPageContent />),
  },
});

export const settingsSubPage = SubPageBlueprint.make({
  name: 'settings',
  params: {
    path: 'settings',
    title: 'Settings',
    loader: () =>
      import('./components/SettingsPage').then(m => <m.SettingsPageContent />),
  },
});
```

How this works:

- `PageBlueprint` **without a `loader`** automatically renders its sub-pages as tabs
- The first sub-page becomes the default (index redirect)
- Each `SubPageBlueprint` gets a tab in the header with its `title`
- Sub-page `path` values are **relative** (no leading `/`)
- Sub-page components render **content only** — no `Page`, `Header`, or `HeaderTabs`

If the sub-page content needs padding, use `Container` from `@backstage/ui` as a wrapper inside the component.

## Step 6: Update Hooks and Imports

Replace all `@backstage/core-plugin-api` imports with `@backstage/frontend-plugin-api`:

```typescript
// OLD
import { useApi, useRouteRef, configApiRef } from '@backstage/core-plugin-api';

// NEW
import {
  useApi,
  useRouteRef,
  configApiRef,
} from '@backstage/frontend-plugin-api';
```

### `useRouteRef` Behavior Change

In the new system, `useRouteRef` may return `undefined` for external route refs that aren't bound. Handle this:

```typescript
// OLD — throws if not bound
const docsLink = useRouteRef(externalDocsRouteRef);
// Always a function

// NEW — returns undefined if not bound
const docsLink = useRouteRef(externalDocsRouteRef);
if (docsLink) {
  // render link
}
```

### Common Import Mappings

| Old Import (`@backstage/core-plugin-api`) | New Import (`@backstage/frontend-plugin-api`)       |
| ----------------------------------------- | --------------------------------------------------- |
| `createPlugin`                            | `createFrontendPlugin`                              |
| `createRouteRef`                          | `createRouteRef`                                    |
| `createSubRouteRef`                       | `createSubRouteRef`                                 |
| `createExternalRouteRef`                  | `createExternalRouteRef`                            |
| `createApiRef`                            | `createApiRef`                                      |
| `createApiFactory`                        | `ApiBlueprint.make`                                 |
| `useApi`                                  | `useApi`                                            |
| `useRouteRef`                             | `useRouteRef`                                       |
| `configApiRef`                            | `configApiRef`                                      |
| `discoveryApiRef`                         | `discoveryApiRef`                                   |
| `fetchApiRef`                             | `fetchApiRef`                                       |
| `identityApiRef`                          | `identityApiRef`                                    |
| `storageApiRef`                           | `storageApiRef`                                     |
| `analyticsApiRef`                         | `analyticsApiRef`                                   |
| `createRoutableExtension`                 | `PageBlueprint.make`                                |
| `createComponentExtension`                | Depends on context — blueprint or `createExtension` |

## Step 7: Remove Old System Code

1. Delete `src/plugin.ts` (old `createPlugin`)
2. Delete any `createRoutableExtension` / `createComponentExtension` usage
3. Remove `Page`, `Header`, `PageWithHeader` wrapping from page components
4. Remove `HeaderTabs` if replaced by `SubPageBlueprint` tabs
5. Remove internal `<Routes>`/`<Route>` trees if replaced by sub-pages
6. Remove `@backstage/core-plugin-api` from `package.json` `dependencies`
7. Remove `@backstage/core-compat-api` from `package.json` `dependencies` if present

## Step 8: Update Page Components for BUI

With the full migration, page components should use `@backstage/ui` components and patterns. See the `mui-to-bui-migration` skill for detailed component migration guidance.

Key page-level changes:

- Replace `PageWithHeader` / `Page` + `Header` with framework-provided `PluginHeader` (automatic via `PageLayout`)
- Use `Header` from `@backstage/ui` for optional subtitle/custom actions
- Use `Content` from `@backstage/core-components` for page body padding (this is still used even in NFS pages)
- Replace `ContentHeader` with `Header`'s `customActions` prop
- Replace `HeaderTabs` with `SubPageBlueprint` (tabs are rendered by the framework)

## Real Example: Auth Plugin (Fully Migrated)

The `@backstage/plugin-auth` plugin is a fully migrated example with no `@backstage/core-plugin-api` dependency:

```tsx
// plugins/auth/src/routes.ts
import { createRouteRef } from '@backstage/frontend-plugin-api';

export const rootRouteRef = createRouteRef();

// plugins/auth/src/plugin.tsx
import {
  createFrontendPlugin,
  PageBlueprint,
} from '@backstage/frontend-plugin-api';
import { rootRouteRef } from './routes';

export const AuthPage = PageBlueprint.make({
  params: {
    path: '/oauth2',
    routeRef: rootRouteRef,
    loader: () => import('./components/Router').then(m => <m.Router />),
  },
});

export default createFrontendPlugin({
  pluginId: 'auth',
  extensions: [AuthPage],
  routes: {
    root: rootRouteRef,
  },
});
```

## Real Example: Scaffolder Sub-Pages

The scaffolder plugin demonstrates the sub-page pattern (though it still has dual support — the pattern itself is what a full migration targets):

```tsx
// PageBlueprint WITHOUT loader — framework renders tabs
export const scaffolderPage = PageBlueprint.make({
  params: {
    path: '/create',
    routeRef: rootRouteRef,
  },
});

// Sub-pages with content only
export const templatesSubPage = SubPageBlueprint.make({
  name: 'templates',
  params: {
    path: 'templates',
    title: 'Templates',
    loader: () => import('./TemplatesPage').then(m => <m.TemplatesSubPage />),
  },
});

export const tasksSubPage = SubPageBlueprint.make({
  name: 'tasks',
  params: {
    path: 'tasks',
    title: 'Tasks',
    loader: () => import('./TasksPage').then(m => <m.TasksSubPage />),
  },
});
```

## Migration Checklist

1. [ ] Migrate route refs to `@backstage/frontend-plugin-api` (`createRouteRef`, `createSubRouteRef`, `createExternalRouteRef`)
2. [ ] Replace `createPlugin` with `createFrontendPlugin`
3. [ ] Convert all API factories to `ApiBlueprint` extensions
4. [ ] Convert pages to `PageBlueprint`
5. [ ] Replace internal tab routing with `SubPageBlueprint` where appropriate
6. [ ] Remove `Page`/`Header`/`PageWithHeader` from page components
7. [ ] Add `Header` from `@backstage/ui` where subtitle/custom actions are needed
8. [ ] Replace `HeaderTabs` with `SubPageBlueprint` tabs
9. [ ] Update all `@backstage/core-plugin-api` imports to `@backstage/frontend-plugin-api`
10. [ ] Handle `useRouteRef` possibly returning `undefined`
11. [ ] Remove `src/plugin.ts` (old system entry point)
12. [ ] Remove `src/alpha.tsx` if it existed (merge into main entry)
13. [ ] Remove `@backstage/core-plugin-api` from `package.json` dependencies
14. [ ] Remove `@backstage/core-compat-api` from `package.json` dependencies
15. [ ] Update `package.json` exports (remove `./alpha` if merged into main)
16. [ ] Run `yarn tsc` to check for type errors
17. [ ] Run `yarn lint` to check for missing dependencies
18. [ ] Run `yarn build:api-reports` to update API reports (if the project uses API reports)
19. [ ] Test in a new-system app (`packages/app`)

## Reference

- [Plugin migration guide](https://backstage.io/docs/frontend-system/building-plugins/migrating)
- [Extension blueprints](https://backstage.io/docs/frontend-system/building-plugins/common-extension-blueprints)
- [Utility APIs](https://backstage.io/docs/frontend-system/utility-apis/creating)
- MUI to BUI migration: `mui-to-bui-migration` skill
