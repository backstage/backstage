# Migrating a Plugin to the New Frontend System

This guide migrates one Backstage frontend plugin package from the old frontend system to the new one. Migrate one plugin at a time. If the repository also has an app to migrate, follow the order in `SKILL.md` first.

## Choose a Path

Ask the user which path to take, unless their request already says:

> "Do any apps still on the old frontend system use this plugin?"

| Path                            | When to use it                                                                      | Result                                                                                           |
| ------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| **A: New frontend system only** | Internal plugins whose apps are all on the new `createApp`, including hybrid mode   | Only `createFrontendPlugin`. All `@backstage/core-plugin-api` usage is removed.                  |
| **B: Keep old-system support**  | Published or shared plugins, or plugins still used by an app on the old `createApp` | The old `createPlugin` exports keep working, and a `createFrontendPlugin` is added next to them. |

For path B, also decide where the new plugin is exported from:

- **The main entry.** The new plugin becomes the default export of `src/index.ts`, next to the existing named old-system exports. Apps install it with no extra import path. Choose this when the user wants everything in one entry point.
- **A `./alpha` entry.** The new plugin becomes the default export of `src/alpha.tsx`. Apps import it from `<package>/alpha`. Choose this to mark the new-system API as not yet stable. Many plugins in the Backstage repository use this layout.

Feature discovery reads both the main entry and a declared `./alpha` entry, and installs whichever default export is a frontend plugin. Don't export the plugin as the default from both.

The steps below apply to both paths, unless a step is marked as one path only.

### Migrating Part of a Plugin

In large repositories, a plugin is often migrated a page or tab at a time. When the user asks for only part of a plugin, or the plugin already has a `createFrontendPlugin` with some pages still in the old plugin:

1. Add the new extension, such as a `PageBlueprint` or `EntityContentBlueprint`, to the existing `createFrontendPlugin`, or create one if there is none yet.
2. Remove the matching old extension, its export, and the app's legacy wiring for it. Before removing an export or a route ref, search the repository for other code that uses it.
3. Leave the rest of the old plugin and its dependencies alone. Skip the steps that remove old-system code from the whole plugin until its last page has moved.

## Key Concepts

- **Old system:** `createPlugin` from `@backstage/core-plugin-api`, pages via `createRoutableExtension`, routes defined in the app
- **New system:** `createFrontendPlugin` from `@backstage/frontend-plugin-api`, pages via `PageBlueprint`, routes owned by the plugin
- **Page shell:** Old-system pages render their own `Page`/`Header`/`PageWithHeader` from `@backstage/core-components`. In the new system, the framework's `PageLayout` renders `PluginHeader` from `@backstage/ui` above each page, unless the page sets `noHeader: true`. Step 4 explains how to handle the old shell.
- **Wrapper packages:** Some repositories import `@backstage/*` packages through their own re-exports, such as `@internal/backstage/core-plugin-api`. Treat those imports like the package they re-export in every step.

## Step 1: Route Refs

### Path A: Move Route Refs to `@backstage/frontend-plugin-api`

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

- `createRouteRef()` no longer takes an `id`. The ID is derived from the extension.
- `createSubRouteRef` path must start with `/` and must not end with `/`.
- `createExternalRouteRef()` no longer takes an `id` or `optional` flag.

### Path B: Reuse the Existing Route Refs

Route refs created with `@backstage/core-plugin-api` work in the new system as they are. Pass them to `createFrontendPlugin`'s `routes`/`externalRoutes` and to `PageBlueprint`'s `routeRef`. Since Backstage 1.46 there is no need for `convertLegacyRouteRef` or `compatWrapper` from `@backstage/core-compat-api`, even if older code in the repository still uses them.

### Both Paths: One Route Ref Per Extension

The old system let several extensions share one mount point, for example a standalone page and an entity tab both using `rootRouteRef`. In the new system, a route ref points to one extension. Give the route ref to the extension that other plugins link to, usually the standalone page, and leave `routeRef` out of the others, since `PageBlueprint` and `EntityContentBlueprint` don't require one.

### Both Paths: Set Default Targets for External Route Refs

Set `defaultTarget` on each external route ref to its most common binding target, so apps don't need `bindRoutes` for standard plugin combinations:

```typescript
export const createComponentRouteRef = createExternalRouteRef({
  defaultTarget: 'scaffolder.root',
});

export const viewTechDocRouteRef = createExternalRouteRef({
  params: ['namespace', 'kind', 'name'],
  defaultTarget: 'techdocs.docRoot',
});
```

The `defaultTarget` string uses the `<pluginId>.<routeName>` format, where `routeName` matches a key in the target plugin's `routes` map. The default is only used when the target plugin is installed. Otherwise the route stays unbound.

For path B, `defaultTarget` also works on refs from `@backstage/core-plugin-api`, alongside their existing `id` and `optional` options.

## Step 2: Plugin Definition and Entry Point

Create the plugin with `createFrontendPlugin`:

```tsx
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

For the plugin `icon`, prefer [Remix Icons](https://remixicon.com/) from `@remixicon/react`. An existing MUI icon can be kept with `fontSize="inherit"` (for example `<CategoryIcon fontSize="inherit" />`).

Where this code lives depends on the path:

- **Path A:** Replace `src/plugin.ts` with `src/plugin.tsx` containing the code above, and default-export it from `src/index.ts`. If the plugin had an `src/alpha.tsx`, merge it into the main entry and remove `./alpha` from `exports`.
- **Path B, main entry:** Keep `src/plugin.ts` with its `createPlugin`. Put the new plugin in its own file, such as `src/frontendPlugin.tsx`, and default-export it from `src/index.ts` next to the existing named exports.
- **Path B, `./alpha`:** Keep `src/plugin.ts`. Put the new plugin in `src/alpha.tsx`, or in `src/alpha/` with an `index.ts` for larger plugins, and default-export it.

```typescript
// src/index.ts (path A, or path B with the main entry)
export { default } from './plugin'; // path B: './frontendPlugin'
export { rootRouteRef } from './routes';
```

For path B with `./alpha`, add the entry to `package.json`:

```json
{
  "exports": {
    ".": "./src/index.ts",
    "./alpha": "./src/alpha.tsx",
    "./package.json": "./package.json"
  },
  "typesVersions": {
    "*": {
      "alpha": ["src/alpha.tsx"],
      "package.json": ["package.json"]
    }
  }
}
```

A package without `exports` needs no change here: discovery reads its main entry. If the package has `exports`, or you add them, keep `"./package.json"` in them, or discovery cannot read the package's role and skips it without a warning. Before adding `exports`, check for deep imports of the package from other packages, since `exports` blocks them. Read `references/plugin-packaging.md` in the `frontend-plugin-development` skill for these and the other `package.json` requirements, unique extension names, and declaring feature flags with `featureFlags` instead of registering them imperatively.

## Step 3: API Factories to `ApiBlueprint`

APIs from the old `createPlugin({ apis: [...] })` become `ApiBlueprint` extensions in the plugin's `extensions` array:

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

For path B, keep the old `createApiFactory` in the old plugin as well.

Create API refs with the builder pattern and an explicit `pluginId`:

```typescript
import { createApiRef } from '@backstage/frontend-plugin-api';

export const myPluginApiRef = createApiRef<MyPluginApi>().with({
  id: 'plugin.my-plugin.client',
  pluginId: 'my-plugin',
});
```

The `id` must still be unique across the app. The `pluginId` is ownership metadata, not a namespace prefix.

### API Ownership and Override Rules

The new system enforces **API ownership**: only the owning plugin, or a module targeting it, can provide or override an API. Ownership comes from:

1. The explicit `pluginId` on the `ApiRef`, if set with the builder pattern
2. Otherwise, the `ApiRef` ID string:
   - `plugin.<pluginId>.*` → owned by that plugin
   - `core.*` → owned by the `app` plugin

App adopters who want to replace your plugin's API must use a `createFrontendModule` with `pluginId` matching your plugin. They cannot override it from a module for a different plugin or from a generic `app` module, unlike the old system's `apis` array.

## Step 4: Pages to `PageBlueprint`

### Simple Page

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

The `title` and `icon` params on `PageBlueprint` are only needed if they differ from the plugin's own `title` and `icon`.

The framework renders the plugin's header above the page, so the old page shell (`Page`, `Header`, or `PageWithHeader` from `@backstage/core-components`) would show a second header. Choose one of two options, and ask the user if their request doesn't say:

- **Keep the old shell for now.** Set `noHeader: true` on the `PageBlueprint` and leave the page component as it is. The page looks the same as before, and the change stays small. Moving to the new header can follow in a separate change.
- **Move to the new header.** Remove the old shell from the page component. For a subtitle or actions below the framework header, use `Header` from `@backstage/ui`: move `ContentHeader` actions to its `customActions` prop, `HeaderLabel`s such as owner and lifecycle to its `metadata` prop, and a subtitle to `title` or `description`. The page title itself comes from the `PageBlueprint` or plugin `title`. For an action that belongs on every page of the plugin, such as a support button, use a `PluginHeaderActionBlueprint` extension instead.

```tsx
import { Header } from '@backstage/ui';
import { Content } from '@backstage/core-components';

export function MyPage() {
  return (
    <>
      <Header
        title="Subtitle or description"
        customActions={<SupportButton>Help text</SupportButton>}
      />
      <Content>
        <MyPageContent />
      </Content>
    </>
  );
}
```

Pages that manage their own layout entirely, such as home pages and dashboards, also use `noHeader: true`.

### Path B: One Page, Two Shells

The old plugin still needs pages with their own shell, while the new plugin needs pages without one. Share the page body and vary only the shell.

For simple pages, export two components:

```tsx
// src/components/MyPage/MyPage.tsx
import { Content, PageWithHeader } from '@backstage/core-components';
import { Header } from '@backstage/ui';

// Old system: includes the full page shell
export function MyPage(props: MyPageProps) {
  return (
    <PageWithHeader title="My Plugin" themeId="tool">
      <Content>
        <MyPageContent {...props} />
      </Content>
    </PageWithHeader>
  );
}

// New system: content only, the framework provides the header
export function NfsMyPage(props: MyPageProps) {
  return (
    <>
      <Header customActions={<SupportButton>Help text</SupportButton>} />
      <Content>
        <MyPageContent {...props} />
      </Content>
    </>
  );
}
```

For pages with a lot of shared logic, pass a `headerVariant: 'legacy' | 'bui'` prop to one component, and wrap the content in `PageWithHeader` only for `'legacy'`. `plugins/notifications/src/components/NotificationsPage/NotificationsPage.tsx` uses this pattern.

If the old page component takes customization props, such as `<CatalogIndexPage actions={...} filters={...} />`, give the new variant the same props. Export it under the old name from the entry that has the new plugin, so adopters can pass the same props through `.withOverrides()`. With `./alpha`:

```typescript
// src/alpha.tsx
export { NfsMyPage as MyPage } from './components/MyPage';
```

With the main entry, the old name is already taken, so keep the `Nfs` prefix in the export.

### Entity Page Content

If the plugin provides tabs for the catalog entity page, convert each one to an `EntityContentBlueprint` from `@backstage/plugin-catalog-react/alpha` instead of exporting a component for the app to place. Keep the tab on the same entities by matching the old predicate exactly in `filter`. Read `references/entity-content.md` in the `frontend-plugin-development` skill for filters, groups, multiple tabs, and removing the legacy entity page JSX. For path B, keep the old exported entity components too.

## Step 5: Internal Routing and Sub-Pages

Old plugins often use React Router `<Route>` trees inside a router component. Read the plugin's router and ask the user if it's unclear:

> "Does your plugin use top-level tabs that users navigate between via a header (for example Overview / Settings)? Or does it use detail or drill-down routes (for example `/my-plugin/items/:id`)?"

Keep the internal routing in a `PageBlueprint` `loader` when the routes are detail pages or deeply nested or dynamic:

```tsx
export const myPage = PageBlueprint.make({
  params: {
    path: '/my-plugin',
    routeRef: rootRouteRef,
    loader: () => import('./components/Router').then(m => <m.MyPluginRouter />),
  },
});
```

Use `SubPageBlueprint` when the routes are top-level tabs:

```tsx
// OLD: the plugin owns its tabs and routing
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

```tsx
// NEW (src/extensions.tsx)
import {
  PageBlueprint,
  SubPageBlueprint,
} from '@backstage/frontend-plugin-api';

// Parent page WITHOUT a loader renders its sub-pages as tabs
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

- A `PageBlueprint` **without a `loader`** renders its sub-pages as tabs
- The first sub-page becomes the default (index redirect)
- Each `SubPageBlueprint` gets a tab in the header with its `title`
- Sub-page `path` values are **relative** (no leading `/`)
- Sub-page components render **content only**: no `Page`, `Header`, or `HeaderTabs`

If the sub-page content needs padding, wrap it in `Container` from `@backstage/ui`. The scaffolder plugin, in `plugins/scaffolder/src/alpha/extensions.tsx`, uses this pattern.

## Step 6: Hooks and Imports

In new-system code, `useRouteRef` from `@backstage/frontend-plugin-api` returns `undefined` for external route refs that aren't bound, where the old one throws. Handle the `undefined` case:

```typescript
const docsLink = useRouteRef(externalDocsRouteRef);
if (docsLink) {
  // render link
}
```

For path A, replace every `@backstage/core-plugin-api` import with `@backstage/frontend-plugin-api`, including imports through the repository's own re-exports of it:

| Old Import (`@backstage/core-plugin-api`)                                                              | New Import (`@backstage/frontend-plugin-api`)                                                                                    |
| ------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| `createPlugin`                                                                                         | `createFrontendPlugin`                                                                                                           |
| `createRouteRef`, `createSubRouteRef`, `createExternalRouteRef`                                        | Same names                                                                                                                       |
| `createApiRef`                                                                                         | `createApiRef`                                                                                                                   |
| `createApiFactory`                                                                                     | `ApiBlueprint.make`                                                                                                              |
| `useApi`, `useRouteRef`                                                                                | Same names                                                                                                                       |
| `configApiRef`, `discoveryApiRef`, `fetchApiRef`, `identityApiRef`, `storageApiRef`, `analyticsApiRef` | Same names                                                                                                                       |
| `createRoutableExtension`                                                                              | `PageBlueprint.make`                                                                                                             |
| `createComponentExtension`                                                                             | A plain component export, if other plugins or the app import and render it. Otherwise a blueprint, such as `EntityCardBlueprint` |

## Step 7: Refs and Translations (Path B)

Keep route refs, API refs, and translation refs exported from the main entry point, or from the `-react` package. Consumers import them from there whichever frontend system they use, so don't duplicate them in `./alpha`.

## Step 8: Remove Old System Code (Path A)

1. Delete `src/plugin.ts` (the old `createPlugin`)
2. Delete any `createRoutableExtension` / `createComponentExtension` usage
3. Remove `Page`, `Header`, `PageWithHeader` wrapping from page components
4. Remove `HeaderTabs` if replaced by `SubPageBlueprint` tabs
5. Remove internal `<Routes>`/`<Route>` trees if replaced by sub-pages
6. Remove `@backstage/core-plugin-api` and `@backstage/core-compat-api` from `package.json` `dependencies`

Before removing an export from the plugin's entry point, search the repository for code that imports it. Keep exports that other plugins use, such as helper functions and contexts.

Page components should then use `@backstage/ui` components and patterns. Keep `Content` from `@backstage/core-components` for page body padding. See the `mui-to-bui-migration` skill for component migration.

## Step 9: Dev App and Tests

For both paths, add a smoke test that installs the new plugin in a test app, opens its main page, and asserts on the page's content. Read `references/testing.md` in the `frontend-plugin-development` skill. This is the one test the migration requires.

Existing tests can stay on `@backstage/test-utils`, or the repository's own wrappers around it, as long as they pass. Move a test to `@backstage/frontend-test-utils` when you change it anyway, providing APIs to components through `renderInTestApp({ apis })` and to hooks through `TestApiProvider`.

For path A, if the plugin has a dev app, move `dev/index.tsx` to `createDevApp` from `@backstage/frontend-dev-utils`, and replace `@backstage/dev-utils` with it in `devDependencies`. Port every `.registerApi(...)` call to an `ApiBlueprint` in a dev-only module. Dropping one compiles but throws `NotImplementedError` when the component that uses the API mounts. Read `references/dev-app.md` in the `frontend-plugin-development` skill.

For path B, keep the old dev app working. In a repository with no app, add a new-system dev app next to it, so the new plugin can be checked by hand.

## Step 10: Remove the Old Wiring from the App

If the plugin is installed in an app in the same repository, and that app uses the new `createApp`, remove the plugin's legacy wiring from the app in the same change: legacy `<Route>` elements and entity page JSX for its tabs and cards. Move redirect routes declared in the app's routes to the `app/routes` config; redirects inside the plugin's own router can stay there. Check `app-config` before deleting JSX that an extension now replaces. Read `references/app-integration.md` in the `frontend-plugin-development` skill, and `references/app.md` in this skill for the app side.

## Examples in the Backstage Repository

These live in [`backstage/backstage`](https://github.com/backstage/backstage) and are usually not in the repository you are migrating.

- **Path A:** [`plugins/auth/src/plugin.tsx`](https://github.com/backstage/backstage/blob/master/plugins/auth/src/plugin.tsx) defines a `PageBlueprint` whose loader renders an internal router, with no `@backstage/core-plugin-api` dependency.
- **Path B with `./alpha`:** `plugins/catalog` keeps [`src/plugin.ts`](https://github.com/backstage/backstage/blob/master/plugins/catalog/src/plugin.ts) and adds [`src/alpha/plugin.tsx`](https://github.com/backstage/backstage/blob/master/plugins/catalog/src/alpha/plugin.tsx). [`DefaultCatalogPage.tsx`](https://github.com/backstage/backstage/blob/master/plugins/catalog/src/components/CatalogPage/DefaultCatalogPage.tsx) has `BaseCatalogPage` (old shell) and `NfsBaseCatalogPage` (`Header` + `Content`).
- **Sub-pages:** [`plugins/scaffolder/src/alpha/extensions.tsx`](https://github.com/backstage/backstage/blob/master/plugins/scaffolder/src/alpha/extensions.tsx) uses a `PageBlueprint` without a loader and a `SubPageBlueprint` per tab.
- **Header variant:** [`NotificationsPage.tsx`](https://github.com/backstage/backstage/blob/master/plugins/notifications/src/components/NotificationsPage/NotificationsPage.tsx).

## Checklist

Items marked (A) or (B) apply to that path only.

1. [ ] Route refs: (A) moved to `@backstage/frontend-plugin-api`, (B) reused as they are
2. [ ] `defaultTarget` set on external route refs
3. [ ] `createFrontendPlugin` is the default export of the chosen entry, and `backstage.pluginId` matches its `pluginId`
4. [ ] If the package has `exports`, they match the chosen entry and keep `"./package.json"`
5. [ ] API factories converted to `ApiBlueprint` extensions, with API refs using an explicit `pluginId`
6. [ ] Pages converted to `PageBlueprint`, either keeping the old shell with `noHeader: true` or moved to the new header
7. [ ] Tab routing replaced with `SubPageBlueprint` where it fits
8. [ ] Entity page tabs converted to `EntityContentBlueprint`, keeping the same filter
9. [ ] Every extension of the same kind has a unique `name`
10. [ ] `useRouteRef` returning `undefined` is handled in new-system code
11. [ ] `@backstage/frontend-plugin-api` (and `@backstage/ui` if used) added to `dependencies`
12. [ ] (A) `src/plugin.ts`, `src/alpha.tsx`, and `@backstage/core-plugin-api` and `@backstage/core-compat-api` dependencies removed
13. [ ] (A) Dev app, if any, on `@backstage/frontend-dev-utils` with every registered API ported
14. [ ] (B) Refs and translations exported from the main entry, not duplicated in `./alpha`
15. [ ] (B) Old-system pages and exports still work
16. [ ] Smoke test that renders the new plugin's main page
17. [ ] The plugin's legacy wiring removed from a new-system app in the same repository, with the app's redirects moved to config, and no export removed that other code still imports
18. [ ] `yarn tsc` and `yarn lint` pass
19. [ ] `yarn build:api-reports` run, if the project uses API reports
20. [ ] The dev app renders the page, with no `App startup encountered warnings` block in the browser console
21. [ ] Tested in a new-system app, and for path B also in an old-system app

## Further reading

- [Plugin migration guide](https://backstage.io/docs/frontend-system/building-plugins/migrating)
- [Extension blueprints](https://backstage.io/docs/frontend-system/building-plugins/common-extension-blueprints)
- [Utility APIs](https://backstage.io/docs/frontend-system/utility-apis/creating)
- Packaging, entity content, dev app, testing, app wiring, and troubleshooting: `frontend-plugin-development` skill
- MUI to BUI migration: `mui-to-bui-migration` skill
