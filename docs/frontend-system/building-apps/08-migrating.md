---
id: migrating
title: Migrating Apps
sidebar_label: Migration Guide
# prettier-ignore
description: How to migrate existing apps to the new frontend system
---

## Overview

This section describes how to migrate an existing Backstage app package to use the new frontend system. The app package is typically found at `packages/app` in your project and is responsible for wiring together the Backstage frontend application.

## Switching out `createApp`

The first step in migrating an app is to switch out the `createApp` function for the new one from `@backstage/frontend-api-app`:

```tsx title="in packages/app/src/App.tsx"
// highlight-remove-next-line
import { createApp } from '@backstage/app-defaults';
// highlight-add-next-line
import { createApp } from '@backstage/frontend-defaults';
```

This immediate switch will lead to a lot of breakages that we need to fix.

Let's start by addressing the change to `app.createRoot(...)`, which no longer accepts any arguments. This represents a fundamental change that the new frontend system introduces. In the old system the app element tree that you passed to `app.createRoot(...)` was the primary way that you installed and configured plugins and features in your app. In the new system this is instead replaced by extensions that are wired together into an extension tree. Much more responsibility has now been shifted to plugins, for example you no longer have to manually provide the route path for each plugin page, but instead only configure it if you want to override the default. For more information on how the new system works, see the [architecture](../architecture/00-index.md) section.

Given that the app element tree is most of what builds up the app, it's likely also going to be the majority of the migration effort. In order to make the migration as smooth as possible we have provided a helper that lets you convert an existing app element tree into plugins that you can install in a new app. This in turn allows for a gradual migration of individual plugins, rather than needing to migrate the entire app structure at once.

The helper is called `convertLegacyApp` and is exported from the `@backstage/core-compat-api` package. We will also be using the `convertLegacyAppOptions` helper that lets us re-use the existing app options, also exported from the same package. You will need to add it as a dependency to your app package:

```bash
yarn --cwd packages/app add @backstage/core-compat-api
```

Once installed, import `convertLegacyApp`. If your app currently looks like this:

```tsx title="in packages/app/src/App.tsx"
const app = createApp({
  /* other options */
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
  convertLegacyApp,
  convertLegacyAppOptions,
} from '@backstage/core-compat-api';

const legacyFeatures = convertLegacyApp(
  <>
    <AlertDisplay transientTimeoutMs={2500} />
    <OAuthRequestDialog />
    <AppRouter>
      <Root>{routes}</Root>
    </AppRouter>
  </>,
);

const optionsModule = convertLegacyAppOptions({
  /* other options */
});

const app = createApp({
  features: [optionsModule, ...legacyFeatures],
});

export default app.createRoot();
```

We've taken all the elements that were previously passed to `app.createRoot(...)`, and instead passed them to `convertLegacyApp(...)`. We then pass the features returned by `convertLegacyApp` and forward them to the `features` option of the new `createApp`.

There is one more detail that we need to deal with before moving on. The `app.createRoot()` function now returns a React element rather than a component, so we need to update our app `index.tsx` as follows:

```tsx title="in packages/app/src/index.tsx"
import '@backstage/cli/asset-types';
import React from 'react';
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

At this point the contents of your app should be past the initial migration stage, and we can move on to migrating any remaining options that you may have passed to `createApp`.

## Migrating `createApp` Options

Many of the `createApp` options have been migrated to use extensions instead. Each will have their own [extension blueprint](../architecture/23-extension-blueprints.md) that you use to create a custom extension. To add these standalone extensions to the app they need to be passed to `createFrontendModule`, which bundles them into a _feature_ that you can install in the app. See the [frontend module](../architecture/25-extension-overrides.md#creating-a-frontend-module) section for more information.

For example, assuming you have a `lightTheme` extension that you want to add to your app, you can use the following:

```ts
const app = createApp({
  features: [
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

### `apis`

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
const scmIntegrationsApi = ApiBlueprint.make({
  name: 'scm-integrations',
  params: {
    factory: createApiFactory({
      api: scmIntegrationsApiRef,
      deps: { configApi: configApiRef },
      factory: ({ configApi }) => ScmIntegrationsApi.fromConfig(configApi),
    }),
  },
});
```

### `icons`

Icons are currently installed through the usual options to `createApp`, but will be switched to use extensions in the future.

### `plugins`

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
  experimental: 'all'
```

### `featureFlags`

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
createFrontendPlugin({
  id: 'tech-radar',
  // ...
  featureFlags: [{ name: 'tech-radar' }],
  // ...
});
```

### `components`

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

### `themes`

Themes are now installed as extensions, created using `ThemeBlueprint`.

For example, the following theme configuration:

```tsx
const app = createApp({
  themes: [
    {
      id: 'light',
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
const lightTheme = ThemeBlueprint.make({
  name: 'light',
  params: {
    theme: {
      id: 'light',
      title: 'Light Theme',
      variant: 'light',
      icon: <LightIcon />,
      Provider: ({ children }) => (
        <UnifiedThemeProvider theme={builtinThemes.light} children={children} />
      ),
    },
  },
});
```

### `configLoader`

The config loader API has been slightly changed. Rather than returning a promise for an array of `AppConfig` objects, it should now return the `ConfigApi` directly.

```ts
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

### `icons`

Icons are now installed as extensions, using the `IconBundleBlueprint` to make new instances which can be added to the app.

```ts
import { IconBundleBlueprint } from '@backstage/frontend-plugin-api';

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

### `bindRoutes`

Route bindings can still be done using this option, but you now also have the ability to bind routes using static configuration instead. See the section on [binding routes](../architecture/36-routes.md#binding-external-route-references) for more information.

Note that if you are binding routes from a legacy plugin that was converted using `convertLegacyApp`, you will need to use the `convertLegacyRouteRefs` and/or `convertLegacyRouteRef` to convert the routes to be compatible with the new system.

For example, if both the `catalogPlugin` and `scaffolderPlugin` are legacy plugins, you can bind their routes like this:

```ts
const app = createApp({
  features: convertLegacyApp(...),
  bindRoutes({ bind }) {
    bind(convertLegacyRouteRefs(catalogPlugin.externalRoutes), {
      createComponent: convertLegacyRouteRef(scaffolderPlugin.routes.root),
    });
  },
});
```

### `__experimentalTranslations`

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
TranslationBlueprint.make({
  name: 'catalog-overrides',
  params: {
    resource: createTranslationMessages({
      ref: catalogTranslationRef,
      catalog_page_create_button_title: 'Create Software',
    }),
  },
});
```

## Gradual Migration

After updating all `createApp` options as well as using `convertLegacyApp` to use your existing app structure, you should be able to start up the app and see that it still works. If that is not the case, make sure you read any error messages that you may see in the app as they can provide hints on what you need to fix. If you are still stuck, you can check if anyone else ran into the same issue in our [GitHub issues](https://github.com/backstage/backstage/issues), or ask for help in our [community Discord](https://discord.gg/backstage-687207715902193673).

Assuming your app is now working, let's continue by migrating the rest of the app element tree to use the new system.

First off we'll want to trim away any top-level elements in the app so that only the `routes` are left. For example, continuing where we left off with the following elements:

```tsx title="in packages/app/src/App.tsx"
const legacyFeatures = convertLegacyApp(
  <>
    <AlertDisplay transientTimeoutMs={2500} />
    <OAuthRequestDialog />
    <AppRouter>
      <Root>{routes}</Root>
    </AppRouter>
  </>,
);
```

You can remove all surrounding elements and just keep the `routes`:

```tsx title="in packages/app/src/App.tsx"
const legacyFeatures = convertLegacyApp(routes);
```

This will remove many extension overrides that `convertLegacyApp` put in place, and switch over the shell of the app to the new system. This includes the root layout of the app along with the elements, router, and sidebar. The app will likely not look the same as before, and you'll need to refer to the [sidebar](#sidebar), [app root elements](#app-root-elements) and [app root wrappers](#app-root-wrappers) sections below for information on how to migrate those.

Once that step is complete the work that remains is to migrate all of the [routes](#top-level-routes) and [entity pages](#entity-pages) in the app, including any plugins that do not yet support the new system. For information on how to migrate your own internal plugins, refer to the [plugin migration guide](../building-plugins/05-migrating.md). For external plugins you will need to check the migration status of each plugin and potentially contribute to the effort.

Once these migrations are complete you should be left with an empty `convertLegacyApp(...)` call that you can now remove, and your app should be fully migrated to the new system! 🎉

### Top-level Routes

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

Continue this process for each of your legacy routes until you have migrated all of them. For any plugin with additional extensions installed as children of the `Route`, refer to the plugin READMEs for more detailed instructions. For the entity pages, refer to the [separate section](#entity-pages).

### Entity Pages

The entity pages are typically defined in `packages/app/src/components/catalog` and rendered as a child of the `/catalog/:namespace/:kind/:name` route. The entity pages are typically quite large and bringing in content from quite a lot of different plugins. To help gradually migrate entity pages we provide the `entityPage` option in the `convertLegacyApp` helper. This option lets you pass in an entity page app element tree that will be converted to extensions that are added to the features returned from `convertLegacyApp`.

To start the gradual migration of entity pages, add your `entityPages` to the `convertLegacyApp` call:

```tsx title="in packages/app/src/App.tsx"
/* highlight-remove-next-line */
const legacyFeatures = convertLegacyApp(routes);
/* highlight-add-next-line */
const legacyFeatures = convertLegacyApp(routes, { entityPage });
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
  features: [optionsModule, ...legacyFeatures],
  /* highlight-add-next-line */
  features: [catalogPlugin, optionsModule, ...legacyFeatures],
});
```

If you are not using the default `<CatalogIndexPage />` you can install your custom catalog page as an override for now instead, and fully migrate it to the new system later.

```tsx title="in packages/app/src/App.tsx"
/* highlight-remove-start */
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
/* highlight-remove-end */

const app = createApp({
  /* highlight-remove-next-line */
  features: [catalogPlugin, optionsModule, ...legacyFeatures],
  /* highlight-add-next-line */
  features: [catalogPluginOverride, optionsModule, ...legacyFeatures],
});
```

At this point you should be able to run the app and see that you're not using the new version of the catalog plugin. If you navigate to the entity pages you will likely see a lot of duplicate content at the bottom of the page. These are the duplicates of the entity cards provided by the catalog plugin itself that we mentioned earlier that you need to remove. Clean up the entity pages by removing cards and content from the catalog plugin such as `<EntityAboutCard/>` and `<EntityOrphanWarning/>`.

Once the cleanup is complete you should be left with clean entity pages that are built using a mix of the old and new frontend system. From this point you can continue to gradually migrate plugins that provide content for the entity pages, until all plugins have been fully moved to the new system and the `entityPage` option can be removed.

### Sidebar

New apps feature a built-in sidebar extension (`app/nav`) that will render all nav item extensions provided by plugins. This is a placeholder implementation and not intended as a long-term solution. In the future we will aim to provide a more flexible sidebar extension that allows for more customization out of the box.

Because the built-in sidebar is quite limited you may want to override the sidebar with your own custom implementation. To do so, use `createExtension` directly and refer to the [original sidebar implementation](https://github.com/backstage/backstage/blob/master/plugins/app/src/extensions/AppNav.tsx). The following is an example of how to take your existing sidebar from the `Root` component that you typically find in `packages/app/src/components/Root.tsx`, and use it in an [extension override](../architecture/25-extension-overrides.md):

```tsx
const nav = createExtension({
  namespace: 'app',
  name: 'nav',
  attachTo: { id: 'app/layout', input: 'nav' },
  output: [coreExtensionData.reactElement],
  factory({ inputs }) {
    return [
      coreExtensionData.reactElement(
        <Sidebar>
          {/* Sidebar contents from packages/app/src/components/Root.tsx go here */}
        </Sidebar>,
      ),
    ];
  },
});
```

### App Root Elements

App root elements are React elements that are rendered adjacent to your current `Root` component. For example, in this snippet `AlertDisplay`, `OAuthRequestDialog` and `VisitListener` are all app root elements:

```tsx
export default app.createRoot(
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

The `AlertDisplay` and `OAuthRequestDialog` are already provided as built-in extensions, and so will `VisitListener`. But, if you have your own custom root elements you will need to migrate them to be extensions that you install in the app instead. Use `createAppRootElementExtension` to create said extension and then install it in the app.

Whether the element used to be rendered as a child of the `AppRouter` or not doesn't matter. All new root app elements will be rendered as a child of the app router.

### App Root Wrappers

App root wrappers are React elements that are rendered as a parent of the current `Root` elements. For example, in this snippet the `CustomAppBarrier` is an app root wrapper:

```tsx
export default app.createRoot(
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

Any app root wrapper needs to be migrated to be an extension, created using `AppRootWrapperBlueprint`. Note that if you have multiple wrappers they must be completely independent of each other, i.e. the order in which they the appear in the React tree should not matter. If that is not the case then you should group them into a single wrapper.

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
            // Whenever your component uses legacy core packages, wrap it with "compatWrapper"
            // e.g. props => compatWrapper(<CustomAppBarrier {...props} />)
            Component: CustomAppBarrier,
          },
        }),
      ],
    }),
  ],
  // ...
});
```
