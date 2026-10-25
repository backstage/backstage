---
id: migrating
title: Migrating Apps
sidebar_label: Migration Guide
description: How to migrate existing apps to the new frontend system
---

## Overview

This section describes how to migrate an existing Backstage app package to use the new frontend system. The app package is typically found at `packages/app` in your project and is responsible for wiring together the Backstage frontend application.

> **Who is this for?**
> This guide is intended for maintainers of Backstage app packages (`packages/app`) who want to upgrade from the legacy frontend system to the new extension-based architecture.

> **Prerequisites:**
>
> - Familiarity with your app’s current structure and configuration
> - Yarn workspaces and monorepo setup
> - Access to run `yarn` commands and update dependencies

## Migration

We recommend a **two-phase migration process** to ensure a smooth and manageable transition:

- **Phase 1: Minimal Changes for Hybrid Configuration**
  In this phase, you make the smallest set of changes necessary to enable your app to run in a hybrid mode. This allows you to start using the new frontend system while still relying on compatibility helpers and legacy code. The goal is to unblock your migration quickly, so you can benefit from the new system without a full rewrite.

- **Phase 2: Complete Transition to the New Frontend System**
  After your app is running in hybrid mode, you can gradually refactor your codebase to remove legacy code and compatibility helpers. This phase focuses on fully adopting the new frontend architecture, ensuring your codebase is clean, maintainable, and takes full advantage of the new features.

:::warning

Staying in hybrid mode for too long is not recommended. Support for the legacy version and compatibility helpers will be dropped in the future, so we recommend planning to fully migrate your codebase as soon as possible.

:::

## Checklist

Before you begin, review this checklist to track your progress:

- [ ] Complete minimal changes for hybrid configuration (Phase 1)
- [ ] App starts and works in hybrid mode
- [ ] Gradually migrate and remove legacy code and helpers (Phase 2)
- [ ] Remove legacy plugin routes and imports after migrating their replacements
- [ ] App runs fully on the new frontend system

:::info

If you encounter issues, check [GitHub issues](https://github.com/backstage/backstage/issues) or ask in [Discord](https://discord.gg/backstage-687207715902193673).

:::

## Phase 1: Minimal Changes for Hybrid Configuration

There are 5 steps to minimally change your app to start experimenting with the new frontend system in a hybrid mode.

After completing these steps you should be able to start up the app and see that it still works.

### 1) Switching out `createApp`

To start we'll need to add the new `@backstage/frontend-defaults` package:

```bash
yarn --cwd packages/app add @backstage/frontend-defaults
```

The next step is to switch out the `createApp` function for the new one from `@backstage/frontend-defaults`:

```tsx title="in packages/app/src/App.tsx"
// highlight-remove-next-line
import { createApp } from '@backstage/app-defaults';
// highlight-add-next-line
import { createApp } from '@backstage/frontend-defaults';
```

This immediate switch will lead to a lot of breakages that will be fixed in the upcoming steps.

### 2) Converting the `createApp` options

Most of the legacy `createApp` options — with the exception of `bindRoutes` — can be converted into features that are compatible with the new frontend system. This is accomplished using the `convertLegacyAppOptions` helper, which allows you to continue using your existing configuration while gradually migrating to the new architecture.

To do so, start by adding this dependency to your app package:

```bash
yarn --cwd packages/app add @backstage/core-compat-api
```

Open the file where your application was created. Currently, you should be doing something like this:

```tsx title="in packages/app/src/App.tsx"
const app = createApp({
  apis,
  icons: {
    // Custom icon example
    alert: AlarmIcon,
  },
  featureFlags: [
    {
      name: 'scaffolder-next-preview',
      description: 'Preview the new Scaffolder Next',
      pluginId: '',
    },
  ],
  components: {
    SignInPage: props => {
      return (
        <SignInPage
          {...props}
          providers={['guest', 'custom', ...providers]}
          title="Select a sign-in method"
          align="center"
        />
      );
    },
  },
});
```

Migrate it to the following:

```tsx title="in packages/app/src/App.tsx"
import { createApp } from '@backstage/frontend-defaults';
import { convertLegacyAppOptions } from '@backstage/core-compat-api';

const convertedOptionsModule = convertLegacyAppOptions({
  /* legacy options such as apis, icons, plugins, components, themes and featureFlags */
  apis,
  icons: {
    // Custom icon example
    alert: AlarmIcon,
  },
  featureFlags: [
    {
      name: 'scaffolder-next-preview',
      description: 'Preview the new Scaffolder Next',
      pluginId: '',
    },
  ],
  components: {
    SignInPage: props => {
      return (
        <SignInPage
          {...props}
          providers={['guest', 'custom', ...providers]}
          title="Select a sign-in method"
          align="center"
        />
      );
    },
  },
}});

const app = createApp({
  features: [
    // ...
    convertedOptionsModule,
  ],
});
```

### 3) Fixing the `app.createRoot` call

The `app.createRoot(...)` no longer accepts any arguments. This represents a fundamental change that the new frontend system introduces. In the old system the app element tree that you passed to `app.createRoot(...)` was the primary way that you installed and configured plugins and features in your app. In the new system this is instead replaced by extensions that are wired together into an extension tree. Much more responsibility has now been shifted to plugins, for example you no longer have to manually provide the route path for each plugin page, but instead only configure it if you want to override the default. For more information on how the new system works, see the [architecture](../architecture/00-index.md) section.

Given that the app element tree is most of what builds up the app, it's likely also going to be the majority of the migration effort. In order to make the migration as smooth as possible we have provided a helper that lets you convert an existing app element tree into plugins that you can install in a new app. This in turn allows for a gradual migration of individual plugins, rather than needing to migrate the entire app structure at once.

The helper is called `convertLegacyAppRoot` and is exported from the `@backstage/core-compat-api` package. Once installed, import `convertLegacyAppRoot`. If your app currently looks like this:

```tsx title="in packages/app/src/App.tsx"
const app = createApp({
  /* All legacy options except route bindings */
});

export default app.createRoot(
  <>
    <AlertDisplay transientTimeoutMs={2500} />
    <OAuthRequestDialog />
    <AppRouter>
      <Root>{routes}</Root>
    </AppRouter>
  </>,
);
```

Migrate it to the following:

```tsx title="in packages/app/src/App.tsx"
import {
  // ...
  convertLegacyAppRoot,
} from '@backstage/core-compat-api';

const convertedRootFeatures = convertLegacyAppRoot(
  <>
    <AlertDisplay />
    <OAuthRequestDialog />
    <AppRouter>
      <Root>{routes}</Root>
    </AppRouter>
  </>,
);

const app = createApp({
  features: [
    // ...
    ...convertedRootFeatures,
  ],
});

export default app.createRoot();
```

We've taken all the elements that were previously passed to `app.createRoot(...)`, and instead passed them to `convertLegacyAppRoot(...)`. We then pass the features returned by `convertLegacyAppRoot` and forward them to the `features` option of the new `createApp`.

### 4) Adjusting the app rendering

There is one more detail that we need to deal with before moving on. The `app.createRoot()` function now returns a React element rather than a component, so we need to update our app `index.tsx` as follows:

```tsx title="in packages/app/src/index.tsx"
import '@backstage/cli/asset-types';
import ReactDOM from 'react-dom/client';
// highlight-remove-next-line
import App from './App';
// highlight-add-next-line
import app from './App';

// highlight-remove-next-line
ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
// highlight-add-next-line
ReactDOM.createRoot(document.getElementById('root')!).render(app);
```

### 5) Updating the app test file

You'll also need to make similar changes to your `App.test.tsx` file as well:

```tsx
import { render, waitFor } from '@testing-library/react';
// highlight-remove-next-line
import App from './App';
// highlight-add-next-line
import app from './App';

describe('App', () => {
  it('should render', async () => {
    process.env = {
      NODE_ENV: 'test',
      APP_CONFIG: [
        {
          data: {
            app: { title: 'Test' },
            backend: { baseUrl: 'http://localhost:7007' },
          },
          context: 'test',
        },
      ] as any,
    };

    // highlight-remove-next-line
    const rendered = render(<App />);
    // highlight-add-next-line
    const rendered = render(app);

    await waitFor(() => {
      expect(rendered.baseElement).toBeInTheDocument();
    });
  });
});
```

## Phase 2: Complete Transition to the New Frontend System

If your app starts and works in hybrid mode, you’re ready to begin Phase 2. If not, review the error messages, check the [GitHub issues](https://github.com/backstage/backstage/issues), or ask for help in our [community Discord](https://discord.gg/backstage-687207715902193673).

At this point, the contents of your app should have moved past the initial migration stage. Let's continue by gradually removing legacy code and helpers to fully adopt the new system.

### Choose a customization mechanism

During Phase 2, prefer the least invasive mechanism that meets your needs.
This keeps your app closer to the default frontend system and reduces the
amount of migration code that you need to maintain.

| When you need to...                                                                     | Use...                                                                                        |
| :-------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------- |
| Change behavior that an extension already exposes as a setting.                         | The extension's configuration.                                                                |
| Add a new page, app root element, theme, API, or other independent extension.           | An extension blueprint and a frontend module.                                                 |
| Change an existing extension in a way that its configuration and inputs do not support. | An extension override. Keep the override focused on the missing customization.                |
| Preserve existing legacy app code while you migrate it.                                 | The compatibility helpers in Phase 1, then remove them as the corresponding code is migrated. |

For an overview of available blueprints, look for `*Blueprint` exports in the
relevant frontend package. Before adding an override, check the extension's
configuration and inputs. Those mechanisms are intended for common
customizations and avoid replacing extension behavior.

### Migrating `createApp` options

Many of the `createApp` options have been migrated to use extensions instead. Each will have their own [extension blueprint](../architecture/23-extension-blueprints.md) that you use to create a custom extension. To add these standalone extensions to the app they need to be passed to `createFrontendModule`, which bundles them into a _feature_ that you can install in the app. See the [frontend module](../architecture/25-extension-overrides.md#creating-a-frontend-module) section for more information.

For example, assuming you have a `lightTheme` extension that you want to add to your app, you can use the following:

First we add the `@backstage/frontend-plugin-api` package

```bash
yarn --cwd packages/app add @backstage/frontend-plugin-api
```

Then we can use it like this:

```ts
import { createFrontendModule } from '@backstage/frontend-plugin-api';

const app = createApp({
  features: [
    // ...
    // highlight-add-start
    createFrontendModule({
      pluginId: 'app',
      extensions: [lightTheme],
    }),
    // highlight-add-end
  ],
});
```

You can then also add any additional extensions that you may need to create as part of this migration to the `extensions` array as well.

#### `apis`

[Utility API](../utility-apis/01-index.md) factories are now installed as extensions instead. Pass the existing factory to `ApiBlueprint` and install it in the app. For more information, see the section on [configuring Utility APIs](../utility-apis/04-configuring.md).

For example, the following `apis` configuration:

```ts
const app = createApp({
  apis: [
    createApiFactory({
      api: scmIntegrationsApiRef,
      deps: { configApi: configApiRef },
      factory: ({ configApi }) => ScmIntegrationsApi.fromConfig(configApi),
    }),
  ],
});
```

Can be converted to the following extension:

```ts
import { ApiBlueprint } from '@backstage/frontend-plugin-api';

const scmIntegrationsApi = ApiBlueprint.make({
  name: 'scm-integrations',
  params: defineParams =>
    defineParams({
      api: scmIntegrationsApiRef,
      deps: { configApi: configApiRef },
      factory: ({ configApi }) => ScmIntegrationsApi.fromConfig(configApi),
    }),
});
```

You would then add `scmIntegrationsApi` as an `extension` like you did with `lightTheme` in the [Migrating `createApp` Options](#migrating-createapp-options) section.

#### `plugins`

Plugins are now passed through the `features` options instead.

For example, the following `plugins` configuration:

```tsx
import { homePlugin } from '@backstage/plugin-home';

createApp({
  // ...
  plugins: [homePlugin],
  // ...
});
```

Can be converted to the following `features` configuration:

```tsx
// plugins are now default exported via alpha subpath
import homePlugin from '@backstage/plugin-home/alpha';

createApp({
  // ...
  features: [homePlugin],
  // ...
});
```

Plugins don't even have to be imported manually after installing their package if [features discovery](../architecture/10-app.md#feature-discovery) is enabled.

```yaml title="in app-config.yaml"
app:
  # Enabling plugin and override features discovery
  packages: all # ✨
```

### Removing legacy routes

After migrating a plugin page to the new frontend system, verify that the
new extension is installed and working correctly. You can then remove the
plugin's legacy route, page import, and related route wiring from the app.

Before removing route references or external route bindings, make sure they
are not still used by another plugin or app component.

#### `featureFlags`

Declare feature flags on plugins or frontend modules instead of passing them
to `createApp`.

For example, the following app feature flags configuration:

```tsx
createApp({
  // ...
  featureFlags: [
    {
      pluginId: '',
      name: 'tech-radar',
      description: 'Enables the tech radar plugin',
    },
  ],
  // ...
});
```

Can be converted to the following plugin configuration:

```tsx
import { createFrontendPlugin } from '@backstage/frontend-plugin-api';

createFrontendPlugin({
  pluginId: 'tech-radar',
  // ...
  featureFlags: [{ name: 'tech-radar' }],
  // ...
});
```

This would get added to the `features` array as part of your `createApp` options.

#### `components`

Many app components are now installed as extensions instead using `createComponentExtension`. See the section on [configuring app components](./01-index.md#configure-your-app) for more information.

The `Router` component is now a built-in extension that you can [override](../architecture/25-extension-overrides.md) using `createRouterExtension`.

The Sign-in page is now installed as an extension, created using the `SignInPageBlueprint` instead.

For example, the following sign-in page configuration:

```tsx
const app = createApp({
  components: {
    SignInPage: props => (
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

Can be converted to the following extension:

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

You would then add `signInPage` as an `extension` like you did with `lightTheme` in the [Migrating `createApp` Options](#migrating-createapp-options) section.

#### `themes`

Themes are now installed as extensions, created using `ThemeBlueprint`.

For example, the following theme configuration:

```tsx
const app = createApp({
  themes: [
    {
      id: 'custom-light',
      title: 'Light',
      variant: 'light',
      Provider: ({ children }) => (
        <UnifiedThemeProvider theme={customLightTheme}>
          {children}
        </UnifiedThemeProvider>
      ),
    },
  ],
});
```

Can be converted to the following extension:

```tsx
import { ThemeBlueprint } from '@backstage/plugin-app-react';

const customLightThemeExtension = ThemeBlueprint.make({
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

You would then add `customLightThemeExtension` as an `extension` like you did with `lightTheme` in the [Migrating `createApp` Options](#migrating-createapp-options) section.

#### `configLoader`

The config loader API has been slightly changed. Rather than returning a promise for an array of `AppConfig` objects, it should now return the `ConfigApi` directly.

```ts
import { ConfigReader } from '@backstage/core-app-api';

const app = createApp({
  async configLoader() {
    const appConfigs = await loadAppConfigs();
    // highlight-remove-next-line
    return appConfigs;
    // highlight-add-next-line
    return { config: ConfigReader.fromConfigs(appConfigs) };
  },
});
```

#### `icons`

Icons are now installed as extensions, using the `IconBundleBlueprint` to make new instances which can be added to the app.

```ts
import { IconBundleBlueprint } from '@backstage/plugin-app-react';

const exampleIconBundle = IconBundleBlueprint.make({
  name: 'example-bundle',
  params: {
    icons: {
      user: MyOwnUserIcon,
    },
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

#### `bindRoutes`

Route bindings can still be done using this option, but you now also have the ability to bind routes using static configuration instead. See the section on [binding routes](../architecture/36-routes.md#binding-external-route-references) for more information.

#### `__experimentalTranslations`

Translations are now installed as extensions, created using `TranslationBlueprint`.

For example, the following translations configuration:

```tsx
import { catalogTranslationRef } from '@backstage/plugin-catalog/alpha';
createApp({
  // ...
  __experimentalTranslations: {
    resources: [
      createTranslationMessages({
        ref: catalogTranslationRef,
        catalog_page_create_button_title: 'Create Software',
      }),
    ],
  },
  // ...
});
```

Can be converted to the following extension:

```tsx
import { catalogTranslationRef } from '@backstage/plugin-catalog/alpha';
import { createTranslationMessages } from '@backstage/frontend-plugin-api';
import { TranslationBlueprint } from '@backstage/plugin-app-react';

const catalogTranslations = TranslationBlueprint.make({
  name: 'catalog-overrides',
  params: {
    resource: createTranslationMessages({
      ref: catalogTranslationRef,
      catalog_page_create_button_title: 'Create Software',
    }),
  },
});
```

You would then add `catalogTranslations` as an `extension` like you did with `lightTheme` in the [Migrating `createApp` Options](#migrating-createapp-options) section.

### Migrating `createRoot` components

This will remove many extension overrides that `convertLegacyAppRoot` put in place, and switch over the shell of the app to the new system. This includes the root layout of the app along with the elements, router, and sidebar. The app will likely not look the same as before, and you'll need to refer to the [sidebar](#app-root-sidebar), [app root elements](#app-root-elements) and [app root wrappers](#app-root-wrappers) sections below for information on how to migrate those.

Once that step is complete the work that remains is to migrate all of the [routes](#app-root-routes) and [entity pages](#catalog-entity-page) in the app, including any plugins that do not yet support the new system. For information on how to migrate your own internal plugins, refer to the [plugin migration guide](../building-plugins/05-migrating.md). For external plugins you will need to check the migration status of each plugin and potentially contribute to the effort.

Once these migrations are complete you should be left with an empty `convertLegacyAppRoot(...)` call that you can now remove, and your app should be fully migrated to the new system! 🎉

#### App Root Elements

App root elements are React elements that are rendered adjacent to your current `Root` component. For example, in this snippet `AlertDisplay`, `OAuthRequestDialog` and `VisitListener` are all app root elements:

```tsx title="in packages/app/src/App.tsx"
const convertedRootFeatures = convertLegacyAppRoot(
  <>
    {/* highlight-next-line */}
    <AlertDisplay transientTimeoutMs={2500} />
    {/* highlight-next-line */}
    <OAuthRequestDialog />
    <AppRouter>
      {/* highlight-next-line */}
      <VisitListener />
      <Root>{routes}</Root>
    </AppRouter>
  </>,
);
```

The `AlertDisplay` and `OAuthRequestDialog` are already provided as built-in extensions, and so will `VisitListener`, so you can remove all surrounding elements and just keep the `routes`:

```tsx title="in packages/app/src/App.tsx"
const convertedRootFeatures = convertLegacyAppRoot(routes);
```

But, if you have your own custom root elements you will need to migrate them to be extensions that you install in the app instead. Use `AppRootElementBlueprint` from `@backstage/frontend-plugin-api` (for example `AppRootElementBlueprint.make({ ... })`) to create said extension and then install it in the app.

Whether the element used to be rendered as a child of the `AppRouter` or not doesn't matter. All new root app elements will be rendered as a child of the app router.

#### App Root Wrappers

App root wrappers are React elements that are rendered as a parent of the current `Root` elements. For example, in this snippet the `CustomAppBarrier` is an app root wrapper:

```tsx
const convertedRootFeatures = convertLegacyAppRoot(
  <>
    <AlertDisplay transientTimeoutMs={2500} />
    <OAuthRequestDialog />
    <AppRouter>
      {/* highlight-next-line */}
      <CustomAppBarrier>
        <Root>{routes}</Root>
        {/* highlight-next-line */}
      </CustomAppBarrier>
    </AppRouter>
  </>,
);
```

Any app root wrapper needs to be migrated to be an extension, created using `AppRootWrapperBlueprint` from `@backstage/plugin-app-react`. Note that if you have multiple wrappers they must be completely independent of each other, i.e. the order in which they the appear in the React tree should not matter. If that is not the case then you should group them into a single wrapper.

Here is an example converting the `CustomAppBarrier` into extension:

```tsx
createApp({
  // ...
  features: [
    createFrontendModule({
      pluginId: 'app',
      extensions: [
        AppRootWrapperBlueprint.make({
          name: 'custom-app-barrier',
          params: {
            Component: CustomAppBarrier,
          },
        }),
      ],
    }),
  ],
  // ...
});
```

#### App Root Sidebar

New apps feature a built-in sidebar extension which is created by using the `NavContentBlueprint` in `src/modules/nav/Sidebar.tsx`. The default implementation of the sidebar in this blueprint will render some items explicitly in different groups, and then render the rest of the items. Nav items are auto-discovered from page extensions registered under `app/routes`, with metadata from page config or plugin defaults.

In order to migrate your existing sidebar, you will want to create an override for the `app/nav` extension. You can do this by copying the standard of having a `src/modules/nav/` folder, which can contain an extension which you can install into the `app` in the form of a `module`.

```tsx title="in packages/app/src/modules/nav/index.ts"
import { createFrontendModule } from '@backstage/frontend-plugin-api';
import { SidebarContent } from './Sidebar';

export const navModule = createFrontendModule({
  pluginId: 'app',
  extensions: [SidebarContent],
});
```

Then in the actual implementation for the `SidebarContent` extension, you can provide something like the following, where you implement the entire `Sidebar` component.

The component receives a `navItems` prop with `take(id)` and `rest()` methods for placing specific items in custom positions. The recommended approach is to use `navItems.withComponent(...)` to define a component for rendering each nav item, and then use the returned `take(id)` and `rest()` methods to get pre-rendered elements directly. Items taken from the renderer are also taken from the main list. Keys are automatically assigned when rendering via `rest()`.

```tsx title="in packages/app/src/modules/nav/Sidebar.tsx"
import { NavContentBlueprint } from '@backstage/plugin-app-react';

export const SidebarContent = NavContentBlueprint.make({
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
```

The deprecated `items` prop (a flat list compatible with `<SidebarItem {...item} />`) remains supported for backward compatibility. If you don't want to auto-populate the list, simply remove the rendering of that `SidebarGroup`.

You might also notice that when you're rendering additional fixed icons for plugins (e.g. Search in a dedicated group) these might become duplicated, since that page is also included in `nav.rest()`. To exclude an item from the remaining list, call `nav.take('page:search')` before calling `nav.rest()` — you can discard the return value. Items that have been taken will not appear in `rest()`.

To hide a page from the sidebar without disabling the page itself, use `nav.take('page:...')` in your custom sidebar implementation before calling `nav.rest()`, or disable the page extension in config with `page:<plugin-id>: false`.

#### App Root Routes

Your top-level routes are the routes directly under the `AppRouter` component with the `<FlatRoutes>` element. In a small app they might look something like this:

```tsx title="in packages/app/src/App.tsx"
const routes = (
  <FlatRoutes>
    <Route path="/catalog" element={<CatalogIndexPage />} />
    <Route
      path="/catalog/:namespace/:kind/:name"
      element={<CatalogEntityPage />}
    >
      {entityPage}
    </Route>
    <Route path="/create" element={<ScaffolderPage />} />
    <Route
      path="/tech-radar"
      element={<TechRadarPage width={1500} height={800} />}
    />
  </FlatRoutes>
);
```

Each of these routes needs to be migrated to the new system. You can do it as gradually as you want, with the only restriction being that **all routes from a single plugin must be migrated at once**. This is because plugins discovered from these legacy routes will override any plugins that are installed in your app. If you for example only migrate one of the two routes defined by a plugin, the other route will remain and still override any plugin with the same ID, and you're left with a partial and likely broken plugin.

To migrate a route, you need to remove it from your list of routes and instead install the new version of the plugin in your app. Before doing this you should make sure that the plugin supports the new system. Let's remove the scaffolder route as an example:

```tsx title="in packages/app/src/App.tsx"
const routes = (
  <FlatRoutes>
    <Route path="/catalog" element={<CatalogIndexPage />} />
    <Route
      path="/catalog/:namespace/:kind/:name"
      element={<CatalogEntityPage />}
    >
      {entityPage}
    </Route>
    {/* highlight-remove-next-line */}
    <Route path="/create" element={<ScaffolderPage />} />
    <Route
      path="/tech-radar"
      element={<TechRadarPage width={1500} height={800} />}
    />
  </FlatRoutes>
);
```

If you are using [app feature discovery](../architecture/10-app.md#feature-discovery) the installation step is simple, it's already done! The new version of the scaffolder plugin was already discovered and present in the app, it was simply disabled because the plugin created from the legacy route had higher priority. If you do not use feature discovery, you will instead need to manually install the new scaffolder plugin in your app through the `features` option of `createApp`.

Continue this process for each of your legacy routes until you have migrated all of them. For any plugin with additional extensions installed as children of the `Route`, refer to the plugin READMEs for more detailed instructions. For the entity pages, refer to the [separate section](#catalog-entity-page).

##### Migrating `<Redirect>` routes

If your old routes include `<Redirect>` elements to forward users from one path to another, you can replace them with the built-in redirect configuration on the `app/routes` extension:

```yaml title="app-config.yaml"
app:
  extensions:
    - app/routes:
        config:
          redirects:
            - from: /old-path
              to: /new-path
```

See the [`app/routes` built-in extension documentation](./03-built-in-extensions.md#configuring-redirects) for more details.

### Migrating core, internal and third-party plugins

For certain core plugins — such as the Catalog plugin's entity page — we provide a dedicated step-by-step migration guide, since these plugins often require a more gradual approach due to their complexity.

Refer to the [plugin migration guide](../building-plugins/05-migrating.md) for instructions on migrating internal plugins. For external plugins, check their migration status and contribute if needed.

#### Catalog Entity Page

You can migrate the entity-page shell separately from its content. Start with
the new frontend system (NFS) catalog page and convert your existing content to
extensions, then replace those contributions gradually.

This approach switches directly to the native entity layout. The
[feature-flagged approach](#feature-flagged-catalog-entity-page-migration)
adds setup, but keeps the legacy layout available while you migrate plugin
contributions and validate the new composition.

##### Convert the existing entity page

Keep your existing `entityPage` JSX tree, typically defined in
`packages/app/src/components/catalog/EntityPage.tsx`, and pass it explicitly to
`convertLegacyAppRoot`:

```tsx
import { convertLegacyAppRoot } from '@backstage/core-compat-api';

// highlight-remove-next-line
const legacyFeatures = convertLegacyAppRoot(routes);
// highlight-add-next-line
const legacyFeatures = convertLegacyAppRoot(routes, { entityPage });
```

The explicit option lets conversion find entity content even after you remove
the legacy catalog route.

Conversion walks the JSX children, recognizing `EntityLayout.Route` and
`EntitySwitch` cases. Each overview route (`path="/"`) becomes one
`EntityCardBlueprint` extension of type `content`, containing the whole route
body. Other routes become `EntityContentBlueprint` extensions with their paths
and titles. Synchronous route and switch predicates are preserved, including
first-match switch behavior; async switch predicates are not supported.

Keep these structures visible in the supplied JSX. Conversion does not inspect
the output of arbitrary React components, split nested overview components into
separate cards, or reproduce every legacy layout customization.

The catalog plugin supplies both the page shell and built-in cards such as
About. Remove its legacy routes to select the native plugin. When enabling its
native cards, also remove their legacy JSX to avoid duplicates. Keep conversion
for content that does not yet have a native replacement.

Remove both legacy catalog routes (`/catalog` and
`/catalog/:namespace/:kind/:name`) from `FlatRoutes`, keeping your other routes.
Install the native catalog plugin before the converted features:

```tsx title="packages/app/src/App.tsx"
import React from 'react';
import { Route } from 'react-router-dom';
import { FlatRoutes } from '@backstage/core-app-api';
import { convertLegacyAppRoot } from '@backstage/core-compat-api';
import { createApp } from '@backstage/frontend-defaults';
// highlight-remove-next-line
import { CatalogEntityPage, CatalogIndexPage } from '@backstage/plugin-catalog';
// highlight-add-next-line
import catalogPlugin from '@backstage/plugin-catalog/alpha';
import { entityPage } from './components/catalog/EntityPage';

const routes = (
  <FlatRoutes>
    {/* highlight-remove-start */}
    <Route path="/catalog" element={<CatalogIndexPage />} />
    <Route
      path="/catalog/:namespace/:kind/:name"
      element={<CatalogEntityPage />}
    >
      {entityPage}
    </Route>
    {/* highlight-remove-end */}
    {/* Keep your other legacy routes here. */}
  </FlatRoutes>
);
const legacyFeatures = convertLegacyAppRoot(routes, { entityPage });

const app = createApp({
  features: [
    // highlight-add-next-line
    catalogPlugin,
    // Keep your convertedOptionsModule here, if used.
    ...legacyFeatures,
  ],
  // Keep your existing bindRoutes here, if used.
});

export default app.createRoot();
```

Repeated references to the same plugin instance are removed first. Among the
remaining plugins with the same ID, the last one wins. Leaving a legacy catalog
route in place would let the converted `catalog` plugin override the native one.
With [feature discovery](../architecture/10-app.md#feature-discovery), discovered
features come before explicit features. Remove any other explicit
catalog plugin registrations.

If you have a custom catalog index, use `catalogPlugin.withOverrides(...)` in
the same position, overriding `page:catalog` to load your index component.

Converted contributions attach to NFS extension inputs, separately from the
native catalog plugin. Prefer native cards and tabs where they are available,
and remove their legacy JSX. For example, the catalog plugin supplies the
About card, so remove it from your existing overview:

```tsx
<EntityLayout.Route path="/" title="Overview">
  <>
    {/* highlight-remove-next-line */}
    <EntityAboutCard />
    <OtherExistingContent />
  </>
</EntityLayout.Route>
```

Convert the remaining content until native replacements are available. Keep the
native overview content extension enabled to receive both converted overview
bodies and native cards. Only disable a native extension if you deliberately
keep its legacy counterpart, for example to preserve a customization.

##### Replace individual contributions

As more plugins gain NFS support, replace their remaining legacy JSX with the
native extensions. Install each plugin's native entrypoint or use feature
discovery, following its migration instructions for extensions and defaults.

Only one registration of each plugin is selected. Coordinate its remaining
legacy page routes, converted tabs, and API factories when switching to the
native registration; see [App Root Routes](#app-root-routes). Converted overview
components can remain while their replacements are migrated.

Remove replaced JSX and enable native contributions together to avoid missing
or duplicated content. Preserve applicability predicates and tab paths, and
configure groups as needed; see
[Configure groups, titles, and icons](../../features/software-catalog/catalog-customization.md#configure-groups-titles-and-icons).

Adjust the overview layout as cards move out: conversion keeps the inner layout
of each overview body, while NFS arranges native cards outside it.

Once all entity contributions and routing compatibility are replaced, remove
the `entityPage` option and legacy tree.

For more on entity card and tab extensions, see
[Plugin specific extensions](../building-plugins/01-index.md#plugin-specific-extensions)
and [Common Extension Blueprints](../building-plugins/03-common-extension-blueprints.md).

#### Feature-flagged catalog entity-page migration

A feature flag lets migration owners preview the NFS pages while other users
stay on the legacy layout. This adds setup, but each user can switch between
the layouts while the migration is in progress.

Keep the shared `entityPage` tree and native plugins from the setup above, but
conditionally register the legacy catalog routes and retain replaced JSX for
legacy mode. Apply this variant before removing the legacy routes and
contributions. Plugin selection still follows the precedence rules above.

##### Choose the page experience at app startup

Register a feature flag to switch between the legacy and NFS entity pages.
Creating a Utility API outside its factory is an anti-pattern in NFS, but the
legacy routes and entity-page JSX are constructed before the app's APIs are
available. This temporary workaround lets them read the flag early. Remove it
as soon as the migration is complete.

```ts title="packages/app/src/modules/entityPageMigration.ts"
import { ReactElement } from 'react';
import { LocalStorageFeatureFlags } from '@backstage/core-app-api';
import {
  ApiBlueprint,
  createFrontendModule,
  featureFlagsApiRef,
} from '@backstage/frontend-plugin-api';

// Temporary migration workaround; remove when the migration is complete.
const featureFlags = new LocalStorageFeatureFlags();

export const isNfsEntityPageEnabled = featureFlags.isActive('nfs-entity-page');

export function notInNfs(element: ReactElement) {
  return isNfsEntityPageEnabled ? null : element;
}

export const entityPageMigrationModule = createFrontendModule({
  pluginId: 'app',
  featureFlags: [{ name: 'nfs-entity-page' }],
  extensions: [
    ApiBlueprint.make({
      name: 'feature-flags',
      params: defineParams =>
        defineParams({
          api: featureFlagsApiRef,
          deps: {},
          factory: () => featureFlags,
        }),
    }),
  ],
});
```

The module registers the flag and overrides `api:app/feature-flags` to return
the same instance. If your app already customizes this API, share that
implementation instead of adding a second override. The exported value and
`notInNfs` helper are app code, not framework APIs.

Gate both legacy catalog routes together. Keep other legacy routes in the same
`FlatRoutes`, and retain your existing converted options and route bindings:

```tsx title="packages/app/src/App.tsx"
import React from 'react';
import { Route } from 'react-router-dom';
import { FlatRoutes } from '@backstage/core-app-api';
import { convertLegacyAppRoot } from '@backstage/core-compat-api';
import { createApp } from '@backstage/frontend-defaults';
import { CatalogEntityPage, CatalogIndexPage } from '@backstage/plugin-catalog';
import catalogPlugin from '@backstage/plugin-catalog/alpha';
import { entityPage } from './components/catalog/EntityPage';
// highlight-add-start
import {
  entityPageMigrationModule,
  isNfsEntityPageEnabled,
} from './modules/entityPageMigration';
// highlight-add-end

const routes = (
  <FlatRoutes>
    {/* highlight-remove-start */}
    <Route path="/catalog" element={<CatalogIndexPage />} />
    <Route
      path="/catalog/:namespace/:kind/:name"
      element={<CatalogEntityPage />}
    >
      {entityPage}
    </Route>
    {/* highlight-remove-end */}
    {/* highlight-add-start */}
    {isNfsEntityPageEnabled ? null : (
      <Route path="/catalog" element={<CatalogIndexPage />} />
    )}
    {isNfsEntityPageEnabled ? null : (
      <Route
        path="/catalog/:namespace/:kind/:name"
        element={<CatalogEntityPage />}
      >
        {entityPage}
      </Route>
    )}
    {/* highlight-add-end */}
    {/* Keep your other legacy routes here. */}
  </FlatRoutes>
);

const legacyFeatures = convertLegacyAppRoot(routes, { entityPage });

const app = createApp({
  features: [
    catalogPlugin,
    // Keep your convertedOptionsModule here, if used.
    ...legacyFeatures,
    // highlight-add-next-line
    entityPageMigrationModule,
  ],
  // Keep your existing bindRoutes here, if used.
});

export default app.createRoot();
```

Keep `catalogPlugin` before `legacyFeatures`, as in the setup above. With
the flag off, the legacy routes produce a converted `catalog` plugin that takes
precedence. With the flag on, neither legacy catalog route is registered, so the
native plugin supplies both pages at the same URLs.

This ordering also works with feature discovery. Conditionally adding
`catalogPlugin` alone would not disable a discovered copy.

Keep passing `entityPage` to conversion in **both flag states**. In legacy mode,
`CatalogEntityPage` renders the original JSX and does not consume the generated
NFS card and content inputs. Other converted features, such as pages, API
factories, route references, and routing compatibility, may still be needed.

##### Replace contributions while keeping the fallback

Keep legacy content for users who have not enabled the flag. Use the module's
`notInNfs` helper to omit it from conversion once its native replacement is
enabled.

Wrap the plugin's legacy contribution in your existing overview. For example,
to use the catalog plugin's native About card only in the new layout:

```tsx
// highlight-add-next-line
import { notInNfs } from '../../modules/entityPageMigration';

<EntityLayout.Route path="/" title="Overview">
  <>
    {/* highlight-remove-next-line */}
    <EntityAboutCard />
    {/* highlight-add-next-line */}
    {notInNfs(<EntityAboutCard />)}
    <OtherExistingContent />
  </>
</EntityLayout.Route>;
```

Keep the native About card enabled. In NFS mode, the native catalog plugin
supplies it and `notInNfs` omits its legacy counterpart. In legacy mode, the
original JSX renders the card.

Use the same pattern for other plugins' contributions. Ensure their native
plugin is selected in NFS mode, and keep the original JSX for the legacy
layout. Native contributions attach to NFS inputs and are not rendered by the
legacy page. Check each plugin's remaining routes and API factories before
changing its registration.

| Contribution                                       | Legacy-page mode                   | NFS-page mode                                 |
| -------------------------------------------------- | ---------------------------------- | --------------------------------------------- |
| Not yet migrated                                   | Original JSX                       | Converted overview body or tab                |
| Migrated with `notInNfs` and a native registration | Original JSX retained for rollback | Native extension; omitted from converted body |

For tabs, combine the exported `isNfsEntityPageEnabled` value with the existing
applicability predicate:

```tsx
// highlight-add-next-line
import { isNfsEntityPageEnabled } from '../../modules/entityPageMigration';

<EntityLayout.Route
  path="/example"
  title="Example"
  // highlight-remove-next-line
  if={entity => isFeatureAvailable(entity)}
  // highlight-add-next-line
  if={entity => !isNfsEntityPageEnabled && isFeatureAvailable(entity)}
>
  <ExistingExampleContent />
</EntityLayout.Route>;
```

Enable the plugin's native `EntityContentBlueprint` extension for NFS mode,
keeping its applicability rule and tab path. A false legacy `if` predicate hides
the tab but still lets conversion discover its plugin.

To select the native plugin while retaining that JSX, exclude its package from
feature discovery and explicitly register it after `legacyFeatures` in NFS
mode. For example, for TechDocs:

```yaml title="app-config.yaml"
app:
  packages:
    exclude:
      # highlight-add-next-line
      - '@backstage/plugin-techdocs'
```

```tsx title="packages/app/src/App.tsx"
// highlight-add-next-line
import techdocsPlugin from '@backstage/plugin-techdocs/alpha';

const app = createApp({
  features: [
    catalogPlugin,
    ...legacyFeatures,
    entityPageMigrationModule,
    // highlight-add-next-line
    ...(isNfsEntityPageEnabled ? [techdocsPlugin] : []),
  ],
});
```

Without the exclusion, discovery can retain the native instance at its earlier
position, letting the converted plugin win. Check the plugin's page routes and
API factories before changing precedence.

Configure the replacement's group as needed; see
[Configure groups, titles, and icons](../../features/software-catalog/catalog-customization.md#configure-groups-titles-and-icons).

Use the same flag value for layout changes as cards move into native
composition. For example, a remaining column could use
`isNfsEntityPageEnabled ? 12 : 6` for its width. Check the layout in both states.

##### Roll out and retire the fallback

1. During migration, owners enable the flag in their own settings to preview
   and validate the NFS pages. Other users stay on the legacy pages by default.
   Test both states with representative entities, checking content, layout,
   tabs, deep links, and actions that use plugin APIs or route bindings.
1. Optionally roll out NFS as the default before final cleanup, with a temporary
   opt-out. Invert the check in the shared module: register `legacy-entity-page`
   and set `isNfsEntityPageEnabled = !featureFlags.isActive('legacy-entity-page')`.
   The route checks and `notInNfs` helper follow the new default. You can skip
   this step and switch everyone directly when the migration is complete.
1. Once all entity content is native and the new layout is ready, remove the
   legacy catalog routes, entity-page JSX, and `entityPage` conversion option.
   Remove the rollout flag, helpers, and migration-only API override together.
   Keep any pre-existing custom API wiring, and retire any remaining conversion
   helpers as described below.

### Retire `convertLegacyAppRoot`

Treat the removal of `convertLegacyAppRoot` as a Phase 2 milestone. You can
remove it when the call no longer receives legacy root elements, routes, or the
`entityPage` option. Remove the call, its import, and the converted features
from the `features` array. Then start your app to verify that the new frontend
system provides the expected routes, navigation, and page content without the
compatibility helper.

## Enable the new templates for `yarn new`

It's encouraged that once you switch over to using the new frontend system, that new plugins that you create are using the new frontend system. This means that you're not instantly creating legacy plugins that will eventually need migration.

This practice is also pretty important early on, as it's going to help you get familiar with the practices of the new frontend system.

The `yarn new` command now defaults to the new frontend system templates for frontend plugins. If you have an older app that was created before this change, you can simply update the `@backstage/cli-module-new` package to get access to the new templates.

## Troubleshooting

### Using the App Visualizer Plugin

We'd recommend that you install the `app-visualizer` plugin to help your troubleshooting.

For installation instructions, please read [App Visualizer](./09-app-visualizer.md).

#### Using the App Visualizer During Migration

During migration, the tree view is particularly helpful for:

- **Verifying plugin detection** — After converting your app with `convertLegacyAppOptions` and `convertLegacyAppRoot`, open the tree view to confirm that all expected plugins appear. Legacy plugins that were converted will show up alongside native new-system plugins.

- **Spotting duplicate extensions** — If you see duplicate entries for the same plugin or page, it likely means the plugin is being loaded both through the legacy conversion helpers and the new system. See the [duplicate cards troubleshooting section](#im-seeing-duplicate-cards-for-entity-pages) below.

- **Sharing debug output** — When raising issues, use the text view to copy your extension tree and include it in your bug report. This gives maintainers immediate visibility into your app's structure.

You can also use the **Copy tree as JSON** button in the page header to export the full extension tree as a JSON structure, which can be attached to issue reports for deeper analysis.

### I'm seeing duplicate cards for Entity Pages

Conversion contributes each legacy overview body to the new entity page alongside
native cards from installed plugins. If both supply the same content, suppress
one registration. During a feature-flagged rollout, keep the legacy JSX for
rollback using the [incremental replacement pattern](#replace-contributions-while-keeping-the-fallback),
and enable its native replacement at the same time. After retiring the fallback,
you can remove the replaced JSX entirely. Also check which plugin is selected:
converted plugins can take precedence over native plugins with the same ID.

### `Error: Invalid element inside FlatRoutes, expected Route but found element of type ...`

This means that the `Routes` inside `FlatRoutes` contains something other than a `Route` element. This could be for example a `FeatureFlag` or `RequirePermissions` element. These are not currently supported by the new frontend system. Workarounds include pushing this logic down from the `App.tsx` routes into the plugins themselves as these elements no longer need to live in the `App.tsx` for the system to be able to walk and collect the plugins and routes that are available in the App.

If you have a use case where these are required, please reach out to us either through a [bug report](https://github.com/backstage/backstage/issues/new/choose) or the [community Discord](https://discord.gg/backstage-687207715902193673).

## Next Steps

- Explore the [Backstage demo repository](https://github.com/backstage/demo),
  which uses the new frontend system, for a complete app reference.
- See [architecture docs](../architecture/00-index.md) for more on the new system.
- If you encounter issues, check [GitHub issues](https://github.com/backstage/backstage/issues) or ask in [Discord](https://discord.gg/backstage-687207715902193673).
