---
id: extension-overrides
title: Frontend Extension Overrides
sidebar_label: Extension Overrides
# prettier-ignore
description: Frontend extension overrides
---

> **NOTE: The new frontend system is in alpha and is only supported by a small number of plugins.**

## Introduction

An extension override is a building block of the frontend system that allows you to programmatically override app or plugin extensions anywhere in your application. Since the entire application is built mostly out of extensions from the bottom up, this is a powerful feature. You can use it for example to provide your own app root layout, to replace the implementation of a Utility API with a custom one, to override how the catalog page renders itself, and much more.

In general, most features should have a good level of customization built into them, so that users do not have to leverage extension overrides to achieve common goals. A well written feature often has [configuration](../../conf/) settings, or uses extension inputs for extensibility where applicable. An example of this is the search plugin, which allows you to provide result renderers as inputs rather than replacing the result page wholesale just to tweak how results are shown. Adopters should take advantage of those when possible, and only use extension overrides when it's necessary to entirely replace the extension. Check the respective extension documentation for guidance.

## Override App Extensions

In order to override an app extension, you must create a new extension and add it to the list of overridden features. The steps are: create your extension overrides and use them in Backstage.

### Example

In the example below, we create a file that exports custom extensions for the app's `light` and `dark` themes:

```tsx title="packages/app/src/themes.ts"
import {
  createThemeExtension,
  createExtensionOverrides
} from '@backstage/frontend-plugin-api';
import { apertureThemes } from './themes';
import { ApertureLightIcon, ApertureDarkIcon } from './icons';

// Creating a light theme extension
const apertureLightTheme = createThemeExtension({
  // highlight-start
  namespace: 'app',
  name: 'light',
  // highlight-end
  title: 'Aperture Light Theme',
  variant: 'light',
  icon: <ApertureLightIcon />,
  Provider: ({ children }) => (
    <UnifiedThemeProvider theme={apertureThemes.light} children={children} />
  ),
});

// Creating a dark theme extension
const apertureDarkTheme = createThemeExtension({
  // highlight-start
  namespace: 'app',
  name: 'dark',
  // highlight-end
  title: 'Aperture Dark Theme',
  variant: 'dark',
  icon: <ApertureDarkIcon />,
  Provider: ({ children }) => (
    <UnifiedThemeProvider theme={apertureThemes.dark} children={children} />
  ),
});

// Creating an extension overrides preset
export createExtensionOverrides({
  extensions: [apertureLightTheme, apertureDarkTheme]
});
```

Note that we declare `namespace` as `'app'` while creating the themes, so the system knows we are overriding app extensions. Additionally, to specifically override the `light` and `dark` theme extensions, we set the `name` option to `light` and `dark`. Therefore, to override app theme extensions, we ensure that the extension `namespace` and `name` match those of the default app theme extension definitions.

Now we are able to use the overrides in a Backstage app:

```tsx title="packages/app/src/App.tsx"
import { createApp } from '@backstage/frontend-app-api';
import themeOverrides from './themes';

const app = createApp({
  // highlight-next-line
 features: [themeOverrides],
});

export default app.createRoot().
```

If the plugin you want to change is internal to your company or you just want to replace one of the application's core extensions, you can decide to store the overrides code directly in the app package or extract them to a separate package.

Note that it can still be a good idea to split your overrides out into separate packages in large projects. But it's up to you to decide how to group the extensions into extension overrides.

## Override Plugin Extensions

To override an extension that is provided by a plugin, you need to provide a new extension that has the same ID as the existing extension. That is, all kind, namespace, and name options must match the extension you want to replace. This means that you typically need to provide an explicit `namespace` when overriding extensions from a plugin.

:::info
We recommend that plugin developers share the extension IDs in their plugin documentation, but usually you can infer the ID by following the [naming patterns](./08-naming-patterns.md) documentation.
:::

### Example

Imagine you have a plugin with the ID `'search'`, and the plugin provides a page extension that you want to fully override with your own custom component. To do so, you need to create your page extension with an explicit `namespace` option that matches that of the plugin that you want to override, in this case `'search'`. If the existing extension also has an explicit `name` you'd need to set the `name` of your override extension to the same value as well.

```tsx title="packages/app/src/search.ts"
import { createPageExtension } from '@backstage/frontend-plugin-api';

// Creating a custom search page extension
const customSearchPage = createPageExtension({
  // highlight-next-line
  namespace: 'search',
  // Omitting name since it is the index plugin page
  defaultPath: '/search',
  loader: () => import('./SearchPage').then(m => m.<SearchPage/>),
});

export createExtensionOverrides({
  extensions: [customSearchPage]
});
```

Don't forget to configure your overrides in the `createApp` function:

```tsx title="packages/app/src/App.tsx"
import { createApp } from '@backstage/frontend-app-api';
import searchOverrides from './search';

const app = createApp({
  // highlight-next-line
  features: [searchOverrides],
});

export default app.createRoot();
```

Now let's talk about the last override case, orphan extensions.

## Create Standalone Extensions

Sometimes you just need to quickly create a new extension and not overwrite an app extension or plugin. You can also use overrides to create extensions, but remember that if you want to make this extension available for installation by other users, we recommend providing it via a plugin in a separate package.

### Example

Imagine you want to create a page that is currently only used by your application, like an Institutional page, for example. You can use overrides to extend the Backstage app to render it. To do so, simply create a page extension and pass it to the app as an override:

```tsx title="packages/app/src/App.ts"
import { createApp } from '@backstage/frontend-app-api';
import {
  createPageExtension,
  createExtensionOverrides,
} from '@backstage/frontend-plugin-api';

const app = createApp({
  features: [
    createExtensionOverrides({
      extensions: [
        // highlight-start
        createPageExtension({
          name: 'institutional',
          defaultPath: '/institutional',
          loader: () =>
            import('./institutional').then(m => <m.InstitutionalPage />),
        }),
        // highlight-end
      ],
    }),
  ],
});

export default app.createRoot();
```

Note that we are omitting `namespace` when creating the page extension. When we omit `namespace`, we are telling the system the new extension is standalone and not an application or plugin extension!
