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

Note that in general, most features should have a good level of customizability built into themselves, so that users do not have to leverage extension overrides to achieve common goals. A well written feature often has app-config settings, or uses extension inputs for extensibility where applicable. An example of this is the search plugin which allows you to provide result renderers as inputs rather than replacing the result page wholesale just to tweak how results are shown. Adopters should be taken advantage of those when possible, and only use extension overrides when it's necessary to entirely replace the extension. Check the respective extension documentation if available for guidance.

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

// Creating a dark theme extension;
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

Imagine you have a plugin with the ID `'search'`, and the plugin provides a page extension that you want to fully override with your own custom component. To do so, you need to create your page extension with an explicit `namespace` option that matches that of the plugin that you want to override, in this case `'search'`. If the existing extension also has an explicit `name` you'd need to set the `name` of your override extension to the same value as well.

```tsx
// packages/app/src/search.ts
const customSearchPage = createPageExtension({
  namespace: 'search',
  // Omitting name since it is the root plugin page
  defaultPath: 'search'
  loader: async () => <div>My custom search page</>
});
```

We recommend that plugin developes share the extension IDs in their plugin documentation, but usually you can infer the ID by following the (naming patterns)[./08-naming-patterns] documentation.
