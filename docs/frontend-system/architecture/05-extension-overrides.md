---
id: extension-overrides
title: Frontend Extension Overrides
sidebar_label: Extension Overrides
# prettier-ignore
description: Frontend extension overrides
---

> **NOTE: The new frontend system is in alpha and is only supported by a small number of plugins.**

## Introduction

An extension override is a building block of the Frontend System that allows you to programmatically override app or plugin extensions anywhere in your application. Since the entire application is built mostly out of extensions from the bottom up, this is a powerful feature. You can use it for example to provide your own app root layout, to replace the implementation of a Utility API with your a custom one, to override how the catalog page renders itself, and much more.

Note that in general, most features should have a good level of customizability built into themselves, so that users do not have to leverage extension overrides to achieve common goals. A well written feature often has app-config settings, or uses extension inputs for extensibility where applicable. An example of this is the search plugin which allows you to provide result renderers as inputs rather than replacing the result page wholesale just to tweak how results are shown. Adopters should take advantage of those when possible, and only use extension overrides when it's necessary to entirely replace the extension. Check the respective extension documentation if available for guidance.

## Overriding App Extensions

If you want to override an app extension, you will need to create a new extension to replace the existing one and add it to the list of overridden features. The steps are:

1. Create your extension overrides

In this example below, we are going to create custom extensions for the app light and dark themes:

```tsx title="packages/app/src/themes.ts"
import {
  createThemeExtension,
  createExtensionOverrides
} from '@backstage/frontend-plugin-api';
import { apertureThemes } from './themes';
import { ApertureLightIcon, ApertureDarkIcon } from './icons';

// Creating a light theme extension;
const apertureLightTheme = createThemeExtension({
  namespace: 'app',
  name: 'light',
  title: 'Aperture Light Theme',
  variant: 'light',
  icon: <ApertureLightIcon />,
  Provider: ({ children }) => (
    <UnifiedThemeProvider theme={apertureThemes.light} children={children} />
  ),
});

// Creating a dark theme extension;
const apertureDarkTheme = createThemeExtension({
  namespace: 'app',
  name: 'dark',
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

We exported the overrides for the light and dark app theme extensions from a separate file in the code snippet above. To override the default app's light and dark theme extensions, we must ensure that the extension namespace and name match the ones in the default app themes extension definitions.

2. Use the overrides in your Backstage App

Now we are able to use the overrides in a Backstage app:

```tsx
// packages/app/src/App.tsx
import { createApp } from '@backstage/frontend-app-api';
import apertureOverrides from '@backstage/plugin-aperture-overrides'

const app = createApp({
 features: [ apertureOverrides ],
});

export default app.createRoot().
```

If the plugin you want to change is internal to your company or you just want to replace one of the application's core extensions, you can decide to store the overrides code directly in the app package or extract them to a separate package.

Note that it can still be a good idea to split your overrides out into separate packages in large projects. But it's up to you to decide how to group the extensions into extension overrides.

## Overriding Plugin Extensions

To override an extension that is provided by a plugin, you need to provide an new extension that has the same ID as the existing extension. That is, all kind, namespace, and name options must match the extension you want to replace. This means that you typically need to provide an explicit namespace when overriding extensions from a plugin.

Imagine you have a plugin with the ID `'search'`, and the plugin provides a page extension that you want to fully override with your own custom component. To do so, you need to create your page extension with an explicit `namespace` option that matches that of the plugin that you want to override, in this case `'search'`. If the existing extension also has an explicit `name` you'd need to set the `name` of your override extension to the same value as well.

```tsx
// packages/app/src/search.ts
const customSearchPage = createPageExtension({
  namespace: 'search',
  // Omitting name since it is the index plugin page
  defaultPath: '/search',
  loader: () => Promise.resolve(<div>My custom search page</div>),
});
```

We recommend that plugin developes share the extension IDs in their plugin documentation, but usually you can infer the ID by following the (naming patterns)[./08-naming-patterns] documentation.
