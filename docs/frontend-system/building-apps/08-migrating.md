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

#### `featureFlags`

Declaring features flags in the app is no longer supported, move these declarations to the appropriate plugins instead.

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

But, if you have your own custom root elements you will need to migrate them to be extensions that you install in the app instead. Use `createAppRootElementExtension` to create said extension and then install it in the app.

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

New apps feature a built-in sidebar extension which is created by using the `NavContentBlueprint` in `src/modules/nav/Sidebar.tsx`. The default implementation of the sidebar in this blueprint will render some items explicitly in different groups, and then render the rest of the items which are the other `NavItem` extensions provided by the system.

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

```tsx title="in packages/app/src/modules/nav/Sidebar.tsx"
import { NavContentBlueprint } from '@backstage/plugin-app-react';

export const SidebarContent = NavContentBlueprint.make({
  params: {
    component: ({ items }) => (
      <Sidebar>
        <SidebarLogo />
        <SidebarGroup label="Search" icon={<SearchIcon />} to="/search">
          <SidebarSearchModal />
        </SidebarGroup>
        <SidebarDivider />
        <SidebarGroup label="Menu" icon={<MenuIcon />}>
          ...
        </SidebarGroup>
        <SidebarGroup label="Plugins">
          <SidebarScrollWrapper>
            {/* Items in this group will be scrollable if they run out of space */}
            {items.map((item, index) => (
              <SidebarItem {...item} key={index} />
            ))}
          </SidebarScrollWrapper>
        </SidebarGroup>
      </Sidebar>
    ),
  },
});
```

The `items` property is a list of all extensions provided by the `NavItemBlueprint` that are currently installed in the App. If you don't want to auto populate this list you can simply remove the rendering of that `SidebarGroup`, but otherwise you can see from the above example how a `SidebarItem` element is rendered for each of the items in the list.

You might also notice that when you're rendering additional fixed icons for plugins that these might become duplicated as the plugin provides a `NavItem` extension and you're also rendering one in the `Sidebar` manually. In order to remove the item from the list of `items` which is passed through, we recommend that you disable that extension using config:

```yaml title="in app-config.yaml"
app:
  extensions:
    - nav-item:search: false
    - nav-item:catalog: false
```

You can also determine the order of the provided auto installed `NavItems` that you get from the system in config. The below example ensures that the `catalog` navigation item will proceed the `search` navigation item when being passed through as the `item` prop.

```yaml title="in app-config.yaml"
app:
  extensions:
    - nav-item:catalog
    - nav-item:search
```

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

### Migrating core, internal and third-party plugins

For certain core plugins — such as the Catalog plugin's entity page — we provide a dedicated step-by-step migration guide, since these plugins often require a more gradual approach due to their complexity.

Refer to the [plugin migration guide](../building-plugins/05-migrating.md) for instructions on migrating internal plugins. For external plugins, check their migration status and contribute if needed.

#### Catalog Entity Page

The entity pages are typically defined in `packages/app/src/components/catalog` and rendered as a child of the `/catalog/:namespace/:kind/:name` route. The entity pages are typically quite large and bringing in content from quite a lot of different plugins. To help gradually migrate entity pages we provide the `entityPage` option in the `convertLegacyAppRoot` helper. This option lets you pass in an entity page app element tree that will be converted to extensions that are added to the features returned from `convertLegacyAppRoot`.

To start the gradual migration of entity pages, add your `entityPages` to the `convertLegacyAppRoot` call:

```tsx title="in packages/app/src/App.tsx"
/* highlight-remove-next-line */
const convertedRootFeatures = convertLegacyAppRoot(routes);
/* highlight-add-next-line */
const convertedRootFeatures = convertLegacyAppRoot(routes, { entityPage });
```

Next, you will need to fully migrate the catalog plugin itself. This is because only a single version of a plugin can be installed in the app at a time, so in order to start using the new version of the catalog plugin you need to remove all usage of the old one. This includes both the routes and entity pages. You will need to keep the structural helpers for the entity pages, such as `EntityLayout` and `EntitySwitch`, but remove any extensions like the `<CatalogIndexPage/>` and entity cards and content like `<EntityAboutCard/>` and `<EntityOrphanWarning/>`.

Remove the following routes:

```tsx title="in packages/app/src/App.tsx"
const routes = (
  <FlatRoutes>
    ...
    {/* highlight-remove-start */}
    <Route path="/catalog" element={<CatalogIndexPage />} />
    <Route
      path="/catalog/:namespace/:kind/:name"
      element={<CatalogEntityPage />}
    >
      {entityPage}
    </Route>
    {/* highlight-remove-end */}
    ...
  </FlatRoutes>
);
```

And explicitly install the catalog plugin before the converted legacy features:

```tsx title="in packages/app/src/App.tsx"
/* highlight-add-next-line */
import { default as catalogPlugin } from '@backstage/plugin-catalog/alpha';

const app = createApp({
  /* highlight-remove-next-line */
  features: [convertedOptionsModule, ...convertedRootFeatures],
  /* highlight-add-next-line */
  features: [catalogPlugin, convertedOptionsModule, ...convertedRootFeatures],
});
```

If you are not using the default `<CatalogIndexPage />` you can install your custom catalog page as an override for now instead, and fully migrate it to the new system later.

```tsx title="in packages/app/src/App.tsx"
/* highlight-add-start */
const catalogPluginOverride = catalogPlugin.withOverrides({
  extensions: [
    catalogPlugin.getExtension('page:catalog').override({
      params: {
        loader: async () => (
          <CatalogIndexPage
            pagination={{ mode: 'offset', limit: 20 }}
            filters={<>{/* ... */}</>}
          />
        ),
      },
    }),
  ],
});
/* highlight-add-end */

const app = createApp({
  features: [
    /* highlight-remove-next-line */
    catalogPlugin,
    /* highlight-add-next-line */
    catalogPluginOverride,
    convertedOptionsModule,
    ...convertedRootFeatures,
  ],
});
```

At this point you should be able to run the app and see that you're not using the new version of the catalog plugin. If you navigate to the entity pages you will likely see a lot of duplicate content at the bottom of the page. These are the duplicates of the entity cards provided by the catalog plugin itself that we mentioned earlier that you need to remove. Clean up the entity pages by removing cards and content from the catalog plugin such as `<EntityAboutCard/>` and `<EntityOrphanWarning/>`.

Once the cleanup is complete you should be left with clean entity pages that are built using a mix of the old and new frontend system. From this point you can continue to gradually migrate plugins that provide content for the entity pages, until all plugins have been fully moved to the new system and the `entityPage` option can be removed.

Migrating across the tabs for the Entity Pages should be as simple as removing the `EntityLayout.Route` for each of the plugins that provide tab content, and then this tab should be sourced from the `EntityContent` extensions created by the plugins themselves which will be automatically detected and added to the App.

## Enable the new templates for `yarn new`

It's encouraged that once you switch over to using the new frontend system, that new plugins that you create are using the new frontend system. This means that you're not instantly creating legacy plugins that will eventually need migration.

This practice is also pretty important early on, as it's going to help you get familiar with the practices of the new frontend system.

When creating a new Backstage app with `create-app` you'll automatically get these choices in the `yarn new` command, but if you want to bring these templates to an older app, you can add the following to your root `package.json`:

```json
{
  ...
  "scripts": {
    ...
    "new": "backstage-cli new"
  },
  "backstage": {
    "cli": {
      "new": {
        "globals": {
          "license": "UNLICENSED"
        },
        "templates": [
          "@backstage/cli/templates/new-frontend-plugin",
          "@backstage/cli/templates/new-frontend-plugin-module",
          "@backstage/cli/templates/backend-plugin",
          "@backstage/cli/templates/backend-plugin-module",
          "@backstage/cli/templates/plugin-web-library",
          "@backstage/cli/templates/plugin-node-library",
          "@backstage/cli/templates/plugin-common-library",
          "@backstage/cli/templates/web-library",
          "@backstage/cli/templates/node-library",
          "@backstage/cli/templates/catalog-provider-module",
          "@backstage/cli/templates/scaffolder-backend-module"
        ]
      }
    }
  }
}
```

## Troubleshooting

We'd recommend that you install the `app-visualizer` plugin to help your troubleshooting. If you run `yarn add @backstage/plugin-app-visualizer` in `packages/app` it should be automatically added to the sidebar, and available on `/visualizer`.

There is a `tree` mode that can be very helpful in understanding which plugins are being automatically detected and the extensions that they are providing to the system. You should also be able to see any legacy extensions which are being converted and added to the app.

This can be really useful output when raising any issue to the main repository too, so we can dig in to see what's happening with the system.

### I'm seeing duplicate cards for Entity Pages

When using the `entityPage` option with `convertLegacyAppRoot`, you may notice duplicate cards appearing on your Entity Pages. This happens because the migration helper automatically extracts cards from your existing Entity Page component and adds them to the new system, while the new Entity Page system also automatically includes cards from any plugins installed in your `packages/app` package. This results in the same card appearing twice - once from your legacy component and once from the plugin.

To fix this, simply remove the card definitions from your old Entity Page component. The new system will automatically provide these cards through the installed plugins, so your manual definitions are no longer needed.

### `Error: Invalid element inside FlatRoutes, expected Route but found element of type ...`

This means that the `Routes` inside `FlatRoutes` contains something other than a `Route` element. This could be for example a `FeatureFlag` or `RequirePermissions` element. These are not currently supported by the new frontend system. Workarounds include pushing this logic down from the `App.tsx` routes into the plugins themselves as these elements no longer need to live in the `App.tsx` for the system to be able to walk and collect the plugins and routes that are available in the App.

If you have a use case where these are required, please reach out to us either through a [bug report](https://github.com/backstage/backstage/issues/new/choose) or the [community Discord](https://discord.gg/backstage-687207715902193673).

## Next Steps

- See [architecture docs](../architecture/00-index.md) for more on the new system.
- If you encounter issues, check [GitHub issues](https://github.com/backstage/backstage/issues) or ask in [Discord](https://discord.gg/backstage-687207715902193673).
