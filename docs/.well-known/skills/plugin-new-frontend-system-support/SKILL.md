---
name: plugin-new-frontend-system-support
description: Add new frontend system support to an existing Backstage plugin while keeping the old system working. Use this skill for published or shared plugins that need to work in both old and new frontend system apps.
---

# Adding New Frontend System Support to an Existing Plugin

This skill helps add new frontend system (NFS) support to an existing Backstage plugin while keeping the old system fully functional. The result is a plugin that works in both old and new apps via a dual entry point pattern.

This is the preferred approach for published plugins or plugins that are used by external parties, since it avoids forcing consumers to migrate their app before they are ready.

It is highly recommended to be on Backstage version 1.49.x or above before starting this, although not mandatory, you may face issues with some of the instructions below. This can be verified by looking in the `backstage.json` file in the root of the repository.

## Key Concepts

- **Dual entry point:** The plugin keeps its existing `src/plugin.ts` (old system) and adds a new `src/alpha.tsx` (new system)
- **Old system:** `createPlugin` from `@backstage/core-plugin-api`, pages via `createRoutableExtension`, routes defined in the app
- **New system:** `createFrontendPlugin` from `@backstage/frontend-plugin-api`, pages via `PageBlueprint`, routes owned by the plugin
- **Dual header pattern:** Old system uses `Page`/`Header`/`PageWithHeader` from `@backstage/core-components`; new system relies on the framework's `PageLayout` which renders `PluginHeader` from `@backstage/ui` — so NFS page components should NOT include their own page shell

## Step 1: Create the Alpha Entry Point

Create `src/alpha.tsx` (or `src/alpha/index.ts` for larger plugins) with a `createFrontendPlugin` default export:

```tsx
// src/alpha.tsx
import {
  createFrontendPlugin,
  PageBlueprint,
} from '@backstage/frontend-plugin-api';
import { RiToolsLine } from '@remixicon/react';
import { rootRouteRef } from './routes';

const myPage = PageBlueprint.make({
  params: {
    path: '/my-plugin',
    routeRef: rootRouteRef,
    loader: () => import('./components/MyPage').then(m => <m.NfsMyPage />),
  },
});

export default createFrontendPlugin({
  pluginId: 'my-plugin',
  title: 'My Plugin',
  icon: <RiToolsLine />,
  extensions: [myPage],
  routes: {
    root: rootRouteRef,
  },
  externalRoutes: {
    // same external routes as the old plugin
  },
});
```

For the plugin `icon`, prefer using [Remix Icons](https://remixicon.com/) from `@remixicon/react`. If the plugin already has an existing MUI icon, it can be kept with `fontSize="inherit"` (e.g. `<CategoryIcon fontSize="inherit" />`), but for new icons Remix is the recommended choice.

The `title` and `icon` params on `PageBlueprint` are only needed if they should differ from the plugin's own `title` and `icon` (set in `createFrontendPlugin`). If omitted, the plugin-level values are used.

For larger plugins, organize into `src/alpha/plugin.tsx`, `src/alpha/pages.tsx`, `src/alpha/extensions.tsx`, etc., and re-export from `src/alpha/index.ts`.

## Step 2: Update `package.json` Exports

Add the `./alpha` subpath export and its `typesVersions` entry:

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

Apps import the new plugin as:

```typescript
import myPlugin from '@backstage/plugin-my-plugin/alpha';
```

## Step 3: Implement the Dual Header Pattern

The critical difference between old and new system page components is the **page shell**. In the old system, each page renders its own `Page` + `Header` (or `PageWithHeader`) wrapper. In the new system, the framework's `PageLayout` provides the header via `PluginHeader` automatically — so the NFS page component must **not** include its own page shell.

### Pattern A: Separate Components (Recommended for Simple Pages)

Create two exported components — one for each system:

```tsx
// src/components/MyPage/MyPage.tsx
import {
  Content,
  PageWithHeader,
  ContentHeader,
  SupportButton,
} from '@backstage/core-components';
import { Header } from '@backstage/ui';

// Used by the OLD system — includes the full page shell
export function MyPage() {
  return (
    <PageWithHeader title="My Plugin" themeId="tool">
      <Content>
        <ContentHeader title="">
          <SupportButton>Some help text</SupportButton>
        </ContentHeader>
        <MyPageContent />
      </Content>
    </PageWithHeader>
  );
}

// Used by the NEW system — no page shell, just content
// The framework's PageLayout/PluginHeader provides the title and header
export function NfsMyPage() {
  return (
    <>
      <Header
        title="My Plugin Subtitle"
        customActions={<SupportButton>Some help text</SupportButton>}
      />
      <Content>
        <MyPageContent />
      </Content>
    </>
  );
}
```

Key differences in the NFS variant:

- **No `Page`/`PageWithHeader`** — the framework provides the outer page shell
- **`Header` from `@backstage/ui`** is optional — use it only if you need a subtitle or custom actions below the framework header
- **No `ContentHeader`** — actions move to `Header`'s `customActions` prop
- The shared `<MyPageContent />` component contains the actual page body

### Forwarding Customization Props

If the old system exports a page component with props for customization (e.g. `<CatalogIndexPage actions={...} filters={...} />`), the NFS variant should accept the same props. Export the NFS variant with the same component name from the `./alpha` entry point, so that app adopters can customize it the same way:

```tsx
// src/components/MyPage/MyPage.tsx
export interface MyPageProps {
  actions?: ReactNode;
  filters?: ReactNode;
}

// Old system — exported from src/index.ts
export function MyPage(props: MyPageProps) {
  return (
    <PageWithHeader title="My Plugin" themeId="tool">
      <Content>
        <MyPageContent {...props} />
      </Content>
    </PageWithHeader>
  );
}

// NFS variant — exported from src/alpha.tsx
export function NfsMyPage(props: MyPageProps) {
  return (
    <Content>
      <MyPageContent {...props} />
    </Content>
  );
}
```

The NFS variant is then wired into the `PageBlueprint` loader, and the component itself is re-exported from `./alpha` so adopters can use `.withOverrides()` to pass custom props:

```typescript
// src/alpha.tsx
export { NfsMyPage as MyPage } from './components/MyPage';
```

This way, the old `MyPage` is available from the main entry point, and the same name `MyPage` is available from `./alpha` — both accepting the same props for customization.

### Pattern B: Header Variant Prop (Recommended for Complex Pages)

For pages with significant shared logic, use a `headerVariant` prop pattern:

```tsx
// src/components/MyPage/MyPage.tsx
import { Content, PageWithHeader } from '@backstage/core-components';

function MyPageContent(
  props: MyPageProps & { headerVariant: 'legacy' | 'bui' },
) {
  const { headerVariant, ...rest } = props;

  // ... shared page logic, data fetching, etc.

  const pageContent = <Content>{/* shared page body */}</Content>;

  if (headerVariant === 'bui') {
    return pageContent;
  }

  return (
    <PageWithHeader title="My Plugin" themeId="tool">
      {pageContent}
    </PageWithHeader>
  );
}

// Old system export
export const MyPage = (props: MyPageProps) => (
  <MyPageContent {...props} headerVariant="legacy" />
);

// New system export
export const NfsMyPage = (props: MyPageProps) => (
  <MyPageContent {...props} headerVariant="bui" />
);
```

### Pattern C: Content-Only Sub-Pages (For Tabbed Plugins)

When using `SubPageBlueprint` for tabbed pages, sub-page loaders should render only the content — the parent `PageBlueprint` provides the header and tabs:

```tsx
// src/alpha/extensions.tsx
import {
  PageBlueprint,
  SubPageBlueprint,
} from '@backstage/frontend-plugin-api';

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
      import('../components/OverviewPage').then(m => <m.OverviewPageContent />),
  },
});

export const settingsSubPage = SubPageBlueprint.make({
  name: 'settings',
  params: {
    path: 'settings',
    title: 'Settings',
    loader: () =>
      import('../components/SettingsPage').then(m => <m.SettingsPageContent />),
  },
});
```

Note: when using `SubPageBlueprint`, omit the `loader` from `PageBlueprint` to use the built-in tabbed sub-page rendering. The `PageBlueprint` without a `loader` creates a parent page that renders sub-pages as tabs automatically. If the sub-page content needs padding, use `Container` from `@backstage/ui` as a wrapper inside the component.

## Step 4: Migrate APIs to `ApiBlueprint`

APIs that were part of the old `createPlugin({ apis: [...] })` become `ApiBlueprint` extensions added to the plugin's `extensions` array.

### API Ownership

In the new system, each API has an **owner plugin** that controls who can provide or override it. Ownership can be set explicitly via `pluginId` on the `ApiRef` (recommended), or inferred from the `ApiRef` ID string pattern:

- Explicit `pluginId` on the ref → that plugin owns it
- `plugin.<pluginId>.*` ID → owned by that plugin
- `core.*` ID → owned by the `app` plugin

The recommended way to define API refs in the new system uses the builder pattern with an explicit `pluginId`:

```typescript
// In your -react package
import { createApiRef } from '@backstage/frontend-plugin-api';

export const myPluginApiRef = createApiRef<MyPluginApi>().with({
  id: 'plugin.my-plugin.client',
  pluginId: 'my-plugin',
});
```

When your plugin provides an `ApiBlueprint` in its `extensions` array, the extension is automatically namespaced under your plugin — so the ownership is correct by default:

```typescript
// src/alpha/apis.ts
import {
  ApiBlueprint,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/frontend-plugin-api';
import { myPluginApiRef } from '@internal/plugin-my-plugin-react';
import { MyPluginClient } from '../api';

export const myPluginApi = ApiBlueprint.make({
  params: defineParams =>
    defineParams({
      api: myPluginApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        fetchApi: fetchApiRef,
      },
      factory: ({ discoveryApi, fetchApi }) =>
        new MyPluginClient({ discoveryApi, fetchApi }),
    }),
});
```

Add the API extension to the plugin's `extensions` array.

App adopters who want to override your plugin's API must do so using a `createFrontendModule` targeting your plugin's ID — they cannot override it from a module for a different plugin.

## Step 5: Route Refs

### Reusing Existing Route Refs

Route refs defined using `createRouteRef` from `@backstage/core-plugin-api` can be used directly in the new system — no conversion needed. They work when passed to `createFrontendPlugin`'s `routes`/`externalRoutes` and to `PageBlueprint`'s `routeRef` param:

```tsx
// routes.ts — keep using your existing route refs from @backstage/core-plugin-api
import { createRouteRef } from '@backstage/core-plugin-api';
export const rootRouteRef = createRouteRef({ id: 'my-plugin' });

// alpha.tsx — pass them directly, no conversion needed
const myPage = PageBlueprint.make({
  params: {
    path: '/my-plugin',
    routeRef: rootRouteRef,
    loader: () => import('./MyPage').then(m => <m.NfsMyPage />),
  },
});
```

There is no need for `convertLegacyRouteRef` or `compatWrapper` from `@backstage/core-compat-api` — these are no longer required for plugin migration.

### Default Targets for External Route Refs

When adding new-system support, set `defaultTarget` on your external route refs so that apps don't need explicit route bindings for common cases. The target string uses the `<pluginId>.<routeName>` format, matching the `routes` map of the target plugin. The default is only used when the target plugin is actually installed — otherwise the route remains unbound.

```typescript
// routes.ts
import { createExternalRouteRef } from '@backstage/core-plugin-api';

export const viewTechDocRouteRef = createExternalRouteRef({
  id: 'view-techdoc',
  optional: true,
  params: ['namespace', 'kind', 'name'],
  defaultTarget: 'techdocs.docRoot',
});

export const createComponentRouteRef = createExternalRouteRef({
  id: 'create-component',
  optional: true,
  defaultTarget: 'scaffolder.root',
});
```

This significantly improves the out-of-the-box experience — plugins with sensible defaults "just work" when installed without requiring the app to configure `bindRoutes`.

### `useRouteRef` Behavior Difference

In the new system, `useRouteRef` from `@backstage/frontend-plugin-api` may return `undefined` for unbound external routes. Legacy `useRouteRef` from `@backstage/core-plugin-api` throws an error instead. When writing NFS components, handle the `undefined` case.

## Step 6: Translations

If the plugin uses translations, the translation ref should be exported from the main entry point (`src/index.ts`). There is no need to re-export it from `./alpha` — consumers import translation refs from the main entry point regardless of which frontend system they use.

The same applies to other refs like API refs and route refs: keep them exported from the main entry point (or the `-react` package) and avoid duplicating exports in `./alpha`.

## Real Examples from the Backstage Repo

### Catalog Plugin (Dual Entry Point)

- Old: `plugins/catalog/src/plugin.ts` — `createPlugin` with `createRoutableExtension`
- New: `plugins/catalog/src/alpha/plugin.tsx` — `createFrontendPlugin` with `PageBlueprint`
- Header split: `plugins/catalog/src/components/CatalogPage/DefaultCatalogPage.tsx`
  - `BaseCatalogPage` (old) uses `PageWithHeader` + `ContentHeader`
  - `NfsBaseCatalogPage` (new) uses `Header` from `@backstage/ui` + `Content`

### Scaffolder Plugin (Sub-Pages)

- Old: `plugins/scaffolder/src/plugin.tsx` — single `ScaffolderPage` with internal routing
- New: `plugins/scaffolder/src/alpha/extensions.tsx` — `PageBlueprint` (no loader) + multiple `SubPageBlueprint` entries for templates, tasks, actions, editor
- Sub-page loaders wrap content in `<Content>` only — no page shell

### Notifications Plugin (Header Variant Pattern)

- `plugins/notifications/src/components/NotificationsPage/NotificationsPage.tsx`
- Uses `headerVariant: 'legacy' | 'bui'` prop
- `NfsNotificationsPage` returns content only (no `PageWithHeader`)
- `NotificationsPage` wraps in `PageWithHeader`

### API Docs Plugin (Simple Dual Page)

- `plugins/api-docs/src/components/ApiExplorerPage/DefaultApiExplorerPage.tsx`
- `DefaultApiExplorerPage` (old) uses `PageWithHeader` + `ContentHeader`
- `NfsApiExplorerPage` (new) uses `Header` + `Content`

## Migration Checklist

1. [ ] Create `src/alpha.tsx` (or `src/alpha/` directory) with `createFrontendPlugin`
2. [ ] Add `./alpha` to `package.json` `exports` and `typesVersions`
3. [ ] Create `PageBlueprint` for each top-level page
4. [ ] Create `SubPageBlueprint` for tabbed sub-pages (if applicable)
5. [ ] Convert API factories to `ApiBlueprint` extensions
6. [ ] Implement NFS page variants without page shell (`Page`/`Header`/`PageWithHeader`)
7. [ ] Use `Header` from `@backstage/ui` for subtitle/custom actions in NFS pages
8. [ ] Wire route refs (existing `@backstage/core-plugin-api` refs work directly, no conversion needed)
9. [ ] Ensure translation refs and API refs are exported from the main entry point (not duplicated in `./alpha`)
10. [ ] Add `@backstage/frontend-plugin-api` to `package.json` dependencies
11. [ ] Add `@backstage/ui` to dependencies (if using `Header`)
12. [ ] Run `yarn tsc` to check for type errors
13. [ ] Run `yarn lint` to check for missing dependencies
14. [ ] Test in both old app (`packages/app-legacy`) and new app (`packages/app`)
15. [ ] Run `yarn build:api-reports` to update API reports (if the project uses API reports)

## Reference

- [Plugin migration guide](https://backstage.io/docs/frontend-system/building-plugins/migrating)
- [Extension blueprints](https://backstage.io/docs/frontend-system/building-plugins/common-extension-blueprints)
- [Utility APIs](https://backstage.io/docs/frontend-system/utility-apis/creating)
