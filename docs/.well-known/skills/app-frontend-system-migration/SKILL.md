---
name: app-frontend-system-migration
description: Migrate a Backstage app from the old frontend system to the new one. Use this skill when converting an app to use the new extension-based frontend system, including the hybrid migration phase and the full migration of routes, sidebar, plugins, APIs, themes, and other app-level concerns.
---

# App Frontend System Migration Skill

This skill helps migrate a Backstage app package (`packages/app`) from the old frontend system (`@backstage/app-defaults`) to the new extension-based frontend system (`@backstage/frontend-defaults`).

The migration follows a two-phase approach: first get the app running in hybrid mode with compatibility helpers, then gradually remove legacy code until the app is fully on the new system.

## Key Concepts

- **Old system:** `createApp` from `@backstage/app-defaults`, plugins installed via `<Route>` elements in `FlatRoutes`, manual app shell with `AppRouter` + `Root`
- **New system:** `createApp` from `@backstage/frontend-defaults`, plugins installed as `features`, extensions wired into an extension tree, no manual app shell
- **Feature discovery:** The new system can automatically discover and install plugins from your app's dependencies — no manual imports needed. This is the default for new apps and should be enabled early in migration.
- **Hybrid mode:** The new `createApp` with `convertLegacyAppRoot` and `convertLegacyAppOptions` from `@backstage/core-compat-api` to bridge old code

## Feature Discovery

Feature discovery is one of the biggest quality-of-life improvements in the new frontend system. Once enabled, any plugin added as a `package.json` dependency that exports a new-system plugin is automatically detected and installed — no code changes in `App.tsx` needed.

### Enabling Feature Discovery

Add this to your `app-config.yaml`:

```yaml
app:
  packages: all
```

This is the **recommended default** for all apps using the new frontend system. Enable it as early as Phase 1.

### Filtering Discovered Packages

You can control which packages are discovered using `include` or `exclude` filters:

```yaml
# Only discover specific packages
app:
  packages:
    include:
      - '@backstage/plugin-catalog'
      - '@backstage/plugin-scaffolder'
```

```yaml
# Discover all except specific packages
app:
  packages:
    exclude:
      - '@backstage/plugin-techdocs'
```

### Disabling Individual Extensions

Even with feature discovery enabled, you can disable specific extensions via config without removing the package:

```yaml
app:
  extensions:
    - page:techdocs: false
    - nav-item:search: false
```

### How Discovery Works with Manual Imports

Plugins that are both manually imported in `features` and auto-discovered are deduplicated — no conflicts. This means you can safely enable discovery while still explicitly importing plugins that need customization via `.withOverrides()`.

### When NOT to Use Discovery

Omit `app.packages` from config entirely (not `app.packages: none` — just leave it out) to disable discovery. You might do this if:

- You need full control over which plugins are loaded
- You're in early Phase 1 and want to introduce features one at a time
- You're running in an environment where the `@backstage/cli` webpack integration isn't available

Feature discovery requires that the app is built using `@backstage/cli`, which is the default for all Backstage apps.

## Phase 1: Minimal Hybrid Migration

### Step 1: Switch `createApp`

Replace the import source for `createApp`:

```typescript
// OLD
import { createApp } from '@backstage/app-defaults';

// NEW
import { createApp } from '@backstage/frontend-defaults';
```

### Step 2: Convert `createApp` options

Use `convertLegacyAppOptions` to wrap legacy options (`apis`, `icons`, `featureFlags`, `components`, `themes`) as a feature:

```tsx
import { createApp } from '@backstage/frontend-defaults';
import { convertLegacyAppOptions } from '@backstage/core-compat-api';

const convertedOptionsModule = convertLegacyAppOptions({
  apis,
  icons: { alert: AlarmIcon },
  featureFlags: [
    {
      name: 'scaffolder-next-preview',
      description: 'Preview the new Scaffolder Next',
      pluginId: '',
    },
  ],
  components: {
    SignInPage: props => (
      <SignInPage
        {...props}
        providers={['guest', 'custom', ...providers]}
        title="Select a sign-in method"
        align="center"
      />
    ),
  },
});

const app = createApp({
  features: [convertedOptionsModule],
});
```

### Step 3: Convert the app root

Use `convertLegacyAppRoot` to convert the entire app element tree (routes, sidebar, root elements) into features:

```tsx
import { convertLegacyAppRoot } from '@backstage/core-compat-api';

const convertedRootFeatures = convertLegacyAppRoot(
  <>
    <AlertDisplay transientTimeoutMs={2500} />
    <OAuthRequestDialog />
    <AppRouter>
      <VisitListener />
      <Root>{routes}</Root>
    </AppRouter>
  </>,
);

const app = createApp({
  features: [convertedOptionsModule, ...convertedRootFeatures],
});

export default app.createRoot();
```

Note: `app.createRoot()` now takes **no arguments** and returns a React **element** (not a component).

### Step 4: Update `index.tsx`

The default export is now an element, not a component:

```typescript
// OLD
import App from './App';
ReactDOM.createRoot(document.getElementById('root')!).render(<App />);

// NEW
import app from './App';
ReactDOM.createRoot(document.getElementById('root')!).render(app);
```

### Step 5: Update `App.test.tsx`

Same change for the test file:

```typescript
import app from './App';

const rendered = render(app);
```

## Phase 2: Full Migration

Once the app works in hybrid mode, gradually remove legacy code and compatibility helpers.

### Migrating `createApp` Options

Legacy options become extensions. App-level extensions (themes, icons, sign-in page, translations) must be installed via `createFrontendModule` targeting `pluginId: 'app'`:

```typescript
import { createFrontendModule } from '@backstage/frontend-plugin-api';

const app = createApp({
  features: [
    createFrontendModule({
      pluginId: 'app',
      extensions: [
        lightTheme,
        signInPage,
        exampleIconBundle,
        catalogTranslations,
      ],
    }),
  ],
});
```

#### APIs → `ApiBlueprint`

In the new system, APIs are extensions that follow **ownership rules**. Understanding which `pluginId` to use when wrapping an API in a `createFrontendModule` is critical — using the wrong one will cause conflict errors at runtime.

**Ownership rules:**

- Each API has an **owner plugin**. This can be set explicitly via `pluginId` on the `ApiRef`, or inferred from the `ApiRef` ID string:
  - Explicit `pluginId` on the ref (recommended) → that plugin owns it
  - `core.*` ID → owned by the `app` plugin
  - `plugin.<pluginId>.*` ID → owned by that plugin (e.g. `plugin.catalog.starred-entities` is owned by `catalog`)
  - Other ID prefixes → the prefix itself is the owner
- **Only modules for the owning plugin can provide or override an API.** If plugin `A` tries to provide an API owned by plugin `B`, the system reports an `API_FACTORY_CONFLICT` error and rejects the override.
- **Modules for the same plugin override the plugin's own factory.** This is how apps replace default implementations.

The recommended way to create API refs in the new system uses the builder pattern with an explicit `pluginId`:

```typescript
import { createApiRef } from '@backstage/frontend-plugin-api';

// Recommended: explicit pluginId makes ownership unambiguous
const myApiRef = createApiRef<MyApi>().with({
  id: 'plugin.my-plugin.my-api',
  pluginId: 'my-plugin',
});

// Legacy form: ownership inferred from the id string pattern
const legacyRef = createApiRef<MyApi>({ id: 'plugin.my-plugin.my-api' });
```

The builder form (`createApiRef<T>().with(...)`) is preferred because the `pluginId` is explicit rather than parsed from the ID string. The `id` must still be globally unique across the app — the `pluginId` is ownership metadata, not a namespace prefix.

**Practical impact for app migration:**

Most APIs that were in the old `createApp({ apis: [...] })` are either core APIs (owned by `app`) or plugin-specific APIs. You need to group them into the right modules:

```typescript
import { createFrontendModule, ApiBlueprint } from '@backstage/frontend-plugin-api';

// Core/app-level APIs → module for 'app'
const appApisModule = createFrontendModule({
  pluginId: 'app',
  extensions: [
    ApiBlueprint.make({
      name: 'scm-integrations',
      params: defineParams =>
        defineParams({
          api: scmIntegrationsApiRef,
          deps: { configApi: configApiRef },
          factory: ({ configApi }) => ScmIntegrationsApi.fromConfig(configApi),
        }),
    }),
  ],
});

// Overriding a plugin's API → module for THAT plugin
const catalogApiOverride = createFrontendModule({
  pluginId: 'catalog',
  extensions: [
    ApiBlueprint.make({
      params: defineParams =>
        defineParams({
          api: catalogApiRef,  // id: 'plugin.catalog'
          deps: { ... },
          factory: ({ ... }) => new CustomCatalogClient({ ... }),
        }),
    }),
  ],
});

const app = createApp({
  features: [appApisModule, catalogApiOverride],
});
```

**Common mistake:** Putting all API overrides in a single `createFrontendModule({ pluginId: 'app' })`. This only works for APIs owned by `app` (i.e. `core.*` APIs like `core.config`, `core.discovery`, etc.). Plugin-specific APIs like `plugin.catalog.*` or `plugin.scaffolder.*` must be overridden using a module with the matching `pluginId`.

The old `createApp({ apis: [...] })` pattern didn't have these restrictions — any API could be overridden from the app. In the new system, the ownership model is stricter to prevent accidental conflicts between plugins.

#### Sign-in Page → `SignInPageBlueprint`

```tsx
import { SignInPageBlueprint } from '@backstage/plugin-app-react';

const signInPage = SignInPageBlueprint.make({
  params: {
    loader: async () => props =>
      (
        <SignInPage
          {...props}
          provider={{
            id: 'github-auth-provider',
            title: 'GitHub',
            message: 'Sign in using GitHub',
            apiRef: githubAuthApiRef,
          }}
        />
      ),
  },
});
```

#### Themes → `ThemeBlueprint`

```tsx
import { ThemeBlueprint } from '@backstage/plugin-app-react';

const customLightTheme = ThemeBlueprint.make({
  name: 'custom-light',
  params: {
    theme: {
      id: 'custom-light',
      title: 'Light Theme',
      variant: 'light',
      icon: <LightIcon />,
      Provider: ({ children }) => (
        <UnifiedThemeProvider theme={customLightTheme} children={children} />
      ),
    },
  },
});
```

#### Icons → `IconBundleBlueprint`

Icon bundles attach to the `app` plugin's icons input, so they must be installed via a module for `app`:

```typescript
import { IconBundleBlueprint } from '@backstage/plugin-app-react';
import { createFrontendModule } from '@backstage/frontend-plugin-api';

const exampleIconBundle = IconBundleBlueprint.make({
  name: 'example-bundle',
  params: {
    icons: { user: MyOwnUserIcon },
  },
});

const app = createApp({
  features: [
    createFrontendModule({
      pluginId: 'app',
      extensions: [exampleIconBundle],
    }),
  ],
});
```

#### Translations → `TranslationBlueprint`

Translations attach to the `app` plugin's translations input. Note that `createTranslationMessages` takes a `messages` object with key-value pairs:

```typescript
import { TranslationBlueprint } from '@backstage/plugin-app-react';
import { createTranslationMessages } from '@backstage/frontend-plugin-api';
import { catalogTranslationRef } from '@backstage/plugin-catalog/alpha';

const catalogTranslations = TranslationBlueprint.make({
  name: 'catalog-overrides',
  params: {
    resource: createTranslationMessages({
      ref: catalogTranslationRef,
      messages: {
        'indexPage.title': 'Service directory',
        'indexPage.createButtonTitle': 'Register new service',
      },
    }),
  },
});

const app = createApp({
  features: [
    createFrontendModule({
      pluginId: 'app',
      extensions: [catalogTranslations],
    }),
  ],
});
```

For adding full language translations, use `createTranslationResource` instead:

```typescript
import { createTranslationResource } from '@backstage/frontend-plugin-api';

const userSettingsTranslations = TranslationBlueprint.make({
  name: 'user-settings-zh',
  params: {
    resource: createTranslationResource({
      ref: userSettingsTranslationRef,
      translations: {
        zh: () => import('./userSettings-zh'),
      },
    }),
  },
});
```

### Migrating Root Elements

Built-in elements like `AlertDisplay`, `OAuthRequestDialog`, and `VisitListener` are provided by the framework automatically. Remove them from `convertLegacyAppRoot`:

```tsx
// Before
const convertedRootFeatures = convertLegacyAppRoot(
  <>
    <AlertDisplay transientTimeoutMs={2500} />
    <OAuthRequestDialog />
    <AppRouter>
      <VisitListener />
      <Root>{routes}</Root>
    </AppRouter>
  </>,
);

// After
const convertedRootFeatures = convertLegacyAppRoot(routes);
```

Custom root elements use `AppRootElementBlueprint`, and custom wrappers use `AppRootWrapperBlueprint` from `@backstage/plugin-app-react`.

### Migrating the Sidebar

Create a `NavContentBlueprint` extension to replace the legacy `Root` component:

```tsx
import { NavContentBlueprint } from '@backstage/plugin-app-react';
import { createFrontendModule } from '@backstage/frontend-plugin-api';

const SidebarContent = NavContentBlueprint.make({
  params: {
    component: ({ navItems }) => {
      const nav = navItems.withComponent(item => (
        <SidebarItem icon={() => item.icon} to={item.href} text={item.title} />
      ));

      return (
        <Sidebar>
          <SidebarLogo />
          <SidebarGroup label="Search" icon={<SearchIcon />} to="/search">
            <SidebarSearchModal />
          </SidebarGroup>
          <SidebarDivider />
          <SidebarGroup label="Menu" icon={<MenuIcon />}>
            {nav.take('page:catalog')}
            {nav.take('page:scaffolder')}
            <SidebarDivider />
            <SidebarScrollWrapper>
              {nav.rest({ sortBy: 'title' })}
            </SidebarScrollWrapper>
          </SidebarGroup>
        </Sidebar>
      );
    },
  },
});

export const navModule = createFrontendModule({
  pluginId: 'app',
  extensions: [SidebarContent],
});
```

Nav items are auto-discovered from page extensions. Use `nav.take('page:<pluginId>')` to place specific items, and `nav.rest()` for the remainder. Items that are `take`n are excluded from `rest()`.

### Migrating Routes

Remove routes from `FlatRoutes` one at a time. With feature discovery enabled (the recommended default), this is the only step needed — the new plugin version is already discovered and waiting; it was simply overridden by the legacy route which had higher priority:

```tsx
// BEFORE: plugin page as a legacy route
const routes = (
  <FlatRoutes>
    <Route path="/create" element={<ScaffolderPage />} />
    <Route path="/catalog" element={<CatalogIndexPage />} />
  </FlatRoutes>
);

// AFTER: just remove the route — discovery handles the rest
const routes = (
  <FlatRoutes>
    <Route path="/catalog" element={<CatalogIndexPage />} />
  </FlatRoutes>
);
```

If you are **not** using feature discovery, you need to manually import and install the new plugin version:

```typescript
import scaffolderPlugin from '@backstage/plugin-scaffolder/alpha';

const app = createApp({
  features: [scaffolderPlugin, ...convertedRootFeatures],
});
```

#### All-at-once rule for plugin routes

Only one version of a plugin can be active in the app at a time. When legacy routes remain in `FlatRoutes`, `convertLegacyAppRoot` creates a plugin from them using the same plugin ID as the real plugin. This shadow plugin overrides the new-system version entirely. Because of this:

- **All routes from a single plugin must be removed at the same time.** You cannot migrate one route of a multi-route plugin while keeping others in `FlatRoutes`. For example, if a plugin provides both `/foo` and `/foo/settings`, you must remove both routes together.
- **Entity page content counts as part of the plugin.** Many plugins contribute both a top-level route (in `FlatRoutes`) _and_ entity page cards/content (in the entity pages). These are all part of the same plugin. If you remove the route from `FlatRoutes` but keep the entity page card as JSX in your entity pages, the old entity card JSX is now orphaned — and the new plugin may auto-provide its own version of that card, leading to duplicates or missing content.

The practical consequence: when you migrate a plugin, remove _all_ of its legacy touchpoints — routes _and_ entity page extensions — at the same time.

### Migrating Entity Pages

Entity pages are typically the most complex part of the migration because they pull in content from many different plugins. The `entityPage` option in `convertLegacyAppRoot` provides a way to migrate them gradually.

#### Setting up gradual entity page migration

Pass your entity pages to `convertLegacyAppRoot`:

```typescript
const convertedRootFeatures = convertLegacyAppRoot(routes, { entityPage });
```

This converts your legacy entity page JSX tree into extensions. The structural pieces (`EntityLayout`, `EntitySwitch`) are preserved, while entity cards and content are converted into extensions that live alongside any auto-discovered new-system cards.

#### Migrating the catalog plugin itself

The catalog plugin is special because it owns both the `/catalog` route and the entity page route (`/catalog/:namespace/:kind/:name`). You must migrate both together:

1. Remove the catalog routes from `FlatRoutes`:

```tsx
const routes = (
  <FlatRoutes>
    {/* Remove both catalog routes */}
    {/* <Route path="/catalog" element={<CatalogIndexPage />} /> */}
    {/* <Route path="/catalog/:namespace/:kind/:name" element={<CatalogEntityPage />}> */}
    {/*   {entityPage} */}
    {/* </Route> */}
    <Route path="/create" element={<ScaffolderPage />} />
  </FlatRoutes>
);
```

2. Install the catalog plugin explicitly (before the converted features so it takes priority):

```typescript
import catalogPlugin from '@backstage/plugin-catalog/alpha';

const app = createApp({
  features: [catalogPlugin, convertedOptionsModule, ...convertedRootFeatures],
});
```

3. Pass `entityPage` to `convertLegacyAppRoot` (if not already done) so your existing entity page layout is preserved.

#### Migrating individual plugins out of entity pages

Once the catalog plugin itself is migrated, you can gradually remove legacy entity content from the entity pages. For each plugin that provides entity cards or content:

1. **Remove the legacy JSX** from your entity page components (e.g. remove `<EntityAboutCard />`, `<EntityTechdocsContent />`, `<EntityKubernetesContent />`)
2. The new-system plugin auto-provides these as `EntityCardBlueprint` / `EntityContentBlueprint` extensions that are discovered automatically

If you see **duplicate cards** after removing routes but before removing entity page JSX, that's expected — the new plugin is auto-providing cards while the legacy JSX still renders them. Remove the legacy JSX to resolve the duplication.

#### Migrating entity page tabs

Tabs in entity pages (the `EntityLayout.Route` entries) are provided by `EntityContentBlueprint` extensions in the new system. As you remove legacy entity content JSX, the tabs are automatically sourced from the new-system extensions. The order and grouping of tabs can be configured via `app-config.yaml`:

```yaml
app:
  extensions:
    - page:catalog/entity:
        config:
          groups:
            - overview:
                title: Overview
            - documentation:
                title: Docs
```

#### When is it done?

Once all plugins contributing to entity pages have been migrated, the `entityPage` option can be removed from `convertLegacyAppRoot`, and the entity page component files in `packages/app/src/components/catalog/` can be deleted.

### Migrating Route Bindings

In the new system, plugins should define `defaultTarget` on their external route refs (e.g. `createExternalRouteRef({ defaultTarget: 'scaffolder.root' })`). When plugins set sensible defaults, most `bindRoutes` calls in the app become unnecessary — the routes resolve automatically when the target plugin is installed.

Review your existing `bindRoutes` configuration and remove any bindings that are already covered by default targets in the plugins. For the remaining cases that need custom bindings, you can still use `bindRoutes` or configure them via static config:

```yaml
# app-config.yaml
app:
  routes:
    bindings:
      catalog.createComponent: scaffolder.root
```

## Dependencies

| Purpose               | Old Package                  | New Package                      |
| --------------------- | ---------------------------- | -------------------------------- |
| App creation          | `@backstage/app-defaults`    | `@backstage/frontend-defaults`   |
| Plugin/extension APIs | `@backstage/core-plugin-api` | `@backstage/frontend-plugin-api` |
| App components        | `@backstage/core-components` | `@backstage/ui` + CSS Modules    |
| Compatibility bridge  | —                            | `@backstage/core-compat-api`     |
| App blueprints        | —                            | `@backstage/plugin-app-react`    |

## Migration Checklist

### Phase 1 (Hybrid)

1. [ ] Add `@backstage/frontend-defaults` and `@backstage/core-compat-api` dependencies
2. [ ] Switch `createApp` import to `@backstage/frontend-defaults`
3. [ ] Enable feature discovery: add `app.packages: all` to `app-config.yaml`
4. [ ] Wrap legacy options with `convertLegacyAppOptions`
5. [ ] Wrap app element tree with `convertLegacyAppRoot`
6. [ ] Change `app.createRoot()` to take no arguments
7. [ ] Update `index.tsx` to render element instead of component
8. [ ] Update `App.test.tsx`
9. [ ] Verify app starts and works in hybrid mode

### Phase 2 (Full Migration)

1. [ ] Convert APIs to `ApiBlueprint` extensions
2. [ ] Convert sign-in page to `SignInPageBlueprint`
3. [ ] Convert themes to `ThemeBlueprint`
4. [ ] Convert icons to `IconBundleBlueprint`
5. [ ] Convert translations to `TranslationBlueprint`
6. [ ] Migrate sidebar to `NavContentBlueprint`
7. [ ] Remove built-in root elements (`AlertDisplay`, `OAuthRequestDialog`, etc.)
8. [ ] Migrate routes from `FlatRoutes` to plugin features (one plugin at a time, removing all routes + entity content for each plugin together)
9. [ ] Set up entity page migration with `convertLegacyAppRoot(routes, { entityPage })`
10. [ ] Migrate catalog plugin: remove catalog routes from `FlatRoutes`, install `catalogPlugin` as a feature
11. [ ] Gradually remove legacy entity card/content JSX as each contributing plugin is migrated
12. [ ] Remove `entityPage` option and legacy entity page component files
13. [ ] Remove `convertLegacyAppRoot` and `convertLegacyAppOptions` calls
14. [ ] Remove `@backstage/app-defaults`, `@backstage/core-app-api` dependencies
15. [ ] Run `yarn tsc` and `yarn lint` to verify

## Troubleshooting

- Install `@backstage/plugin-app-visualizer` to inspect the extension tree at `/visualizer`
- Duplicate entity cards: remove legacy card JSX from entity pages — plugins auto-provide them
- `Invalid element inside FlatRoutes`: push `FeatureFlagged`/`RequirePermissions` wrappers into plugin code instead of the route table

## Reference

- [App migration guide](https://backstage.io/docs/frontend-system/building-apps/migrating)
- [Architecture overview](https://backstage.io/docs/frontend-system/architecture/index)
- [Extension blueprints](https://backstage.io/docs/frontend-system/building-plugins/common-extension-blueprints)
- [Installing plugins](https://backstage.io/docs/frontend-system/building-apps/installing-plugins)
