---
id: extension-overrides
title: Frontend Extension Overrides
sidebar_label: Extension Overrides
# prettier-ignore
description: Frontend extension overrides
---

> **NOTE: The new frontend system is in alpha and is only supported by a small number of plugins.**

## Introduction

An extension override is another building block in the Frontend System that allows you to programmatically override app or plugin extensions. Extension overrides are recommended in the following cases:

- Override the app skeleton layout;
- Override a default api implementation;
- Override a default app component;
- Override a plugin's default page;
- Etc.

It is also important to clarify when an override isn't needed. Creating an extension override is not recommended when:

- When you just want to configure a plugin, such as changing the attachment point, a path or any other setting. Be sure to read the extension documentation before overriding an extension to make sure you cannot configure it to work the way you want;
- It is already possible to enable an extension that is already provided by the plugin. Imagine we have a Search plugin that provides a default search result item extension for rendering search results. Consider also that we have a Catalog plugin with a disabled Catalog search result item extension. To change the way Catalog search result items are rendered, you don't need to override the default result item extension. The only thing you need to do is enable the Catalog search result extension via the config file. For other types of search results, the default Search result item will continue to be used.

## Creating an Extension Override

The following steps should be followed to override extensions:

```tsx
// plugins/aperture-overrides/src/overrides.ts
import {
  createThemeApi,
  createExtensionOverrides
} from '@backstage/frontend-plugin-api';

// Creating a light theme extension;
const apertureLightTheme = createThemeApi({ … });

// Creating a light theme extension;
const apertureDarkTheme = createThemeApi({ … });

// Creating an extension overrides preset
export createExtensionOverrides({
  extensions: [apertureLightTheme, apertureDarkTheme]
});

// plugins/aperture-overrides/src/index.ts
export { default } from './overrides';
```

For this example, we are creating overrides for the light and dark theme extensions and exporting the overrides from the plugin index file. Now we are able to use the overrides in a Backstage app:

```tsx
// packages/app/src/App.tsx
import { createApp } from '@backstage/frontend-app-api';
import apertureOverrides from ‘@backstage/plugin-aperture-overrides’

const app = createApp({
 features: [ apertureOverrides ],
});

export default app.createRoot().
```

If the plugin you want to change is internal to your company or you just want to replace one of the application's core extensions, you can decide to create replacements directly in the application for local replacements. See an example below:

```tsx
// packages/app/src/themes.ts
import { createExtensionOverrides } from from '@backstage/frontend-plugin-api';

// Creating the light theme extension;
export const apertureLightTheme = createThemeApi({ … });

// Creating the light theme extension;
const apertureDarkTheme = createThemeApi({ … });

// Exporting your custom extensions
export default [apertureLightTheme, apertureDarkTheme];

// packages/app/src/App.tsx
import { createApp } from '@backstage/frontend-app-api';
import themes from ‘./themes’

const app = createApp({
 features: [
   createExtensionOverrides({
     extensions: [
      ...themes,
     ],
   }),
 ],
});

export default app.createRoot();
```

Note that it can still be a good idea to split your overrides out into separate packages in large projects. But it's up to you to decide how to group the extensions into extension overrides.

## Overriding Existing Extensions

To override an existing extension (which is already provided by a plugin), you need to provide an extension that has the same ID as the existing extension. That is, all kind, namespaces, and name must match the extension you want to replace. This means that you typically need to provide an explicit namespace when overriding extensions from a plugin.

Imagine that we have a plugin with search id and the plugin provides a search page extension that you want to fully override with your own custom component. To do so, you have to create your page extension and inform to the extension factory that the extension namespace is search to make sure you are overriding the search page of the plugin with id 'search' and not creating a anonymous page that will not override thesearch plugin one.

```tsx
// packages/app/src/search.ts
const customSearchPage = createPageExtension({
  namespace: 'search',
  // Omitting name since it is the root plugin page
  defaultPath: 'search'
  loader: async () => <div>My custom search page</>
});
```

We recommend that plugin developes share the extension ids in their plugin documentations, but usually you can infer the id by following the (Naming pattern)[./08-naming-patterns] standars.
