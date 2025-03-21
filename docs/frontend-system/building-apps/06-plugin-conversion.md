---
id: plugin-conversion
title: Converting 3rd-party plugins from the old system
sidebar_label: Converting 3rd-party Plugins
# prettier-ignore
description: Documentation for how to convert 3rd-party plugins to support the new frontend system.
---

If you are using or want to use a 3rd-party plugin that does not yet support the new frontend system in your app, you can often use conversion utilities from `@backstage/core-compat-api` in order wrap the plugin to make it possible to install in your app.

> [!CAUTION]
> The purpose of these utilities is to wrap 3rd-party plugins. Do not use them for your own plugins where you can add support for the new frontend system directly.

## Converting a legacy plugin

The `@backstage/core-compat-api` package exports the `convertLegacyPlugin` function that can be used to convert a legacy plugin to the new frontend system. Simply pass in the old plugin instance and the new plugin will be returned.

```ts
import { techdocsPlugin } from '@backstage/plugin-techdocs';

// TechDocs is used as an example here, it already supports
// the new frontend system so don't use this code directly.
const convertedTechdocsPlugin = convertLegacyPlugin(techdocsPlugin, {
  extensions: [],
});
```

Note that when using `convertLegacyPlugin` we also have to pass an array of extensions. This is because the `convertLegacyPlugin` function does not have access to or know about the different types of extensions in the old system. You instead need to manually convert each of the old extensions that you want to include in the plugin instance.

## Converting legacy extensions

As mentioned above, you need to manually convert each of the old extensions that you want to include in the plugin instance. The `@backstage/core-compat-api` package exports `convertLegacyPageExtension` for this purpose, which can be used to convert a top-level page extension to the new system. Simply pass in the old extension and the new extension will be returned.

```ts
const convertedIndexPage = convertLegacyPageExtension(TechDocsIndexPage);
```

### Overriding inferred parameters

The conversion functions such as `convertLegacyPageExtension` will attempt to infer parameters from the old extension, in particular it uses the name of the old extension to determine things like the name and route paths of the new extension. In some cases you may need to supply your own parameters to the conversion function if the inferred values are not correct.

```ts
const convertedIndexPage = convertLegacyPageExtension(TechDocsIndexPage, {
  name: 'index',
  defaultPath: '/docs',
});
```

### Other types of extensions

The `@backstage/core-compat-api` only provides conversion functions for the built-in extension types, i.e. only page extensions. There are many plugins that define their own extension types, such as the entity content and card extensions for the catalog. For those cases it's up to the plugin libraries to provide their own conversion functions for these types of extensions. For example, `@backstage/plugin-catalog-react/alpha` provides both `convertLegacyEntityContentExtension` and `convertLegacyEntityCardExtension`.

The following are the known conversion functions provided by various libraries:

- `convertLegacyPageExtension` - `@backstage/core-compat-api`
- `convertLegacyEntityContentExtension` - `@backstage/plugin-catalog-react/alpha`
- `convertLegacyEntityCardExtension` - `@backstage/plugin-catalog-react/alpha`

## Putting it all together

Using the plugin converter along with extension converters from various libraries, we can now more fully convert our 3rd-party plugin to be able to install it in an app built with the new frontend system:

```ts
import {
  techdocsPlugin,
  TechDocsIndexPage,
  TechDocsReaderPage,
  EntityTechdocsContent,
} from '@backstage/plugin-techdocs';

const convertedTechdocsPlugin = convertLegacyPlugin(techdocsPlugin, {
  extensions: [
    convertLegacyPageExtension(TechDocsIndexPage, {
      name: 'index',
      defaultPath: '/docs',
    }),
    convertLegacyPageExtension(TechDocsReaderPage, {
      defaultPath: '/docs/:namespace/:kind/:name/*',
    }),
    convertLegacyEntityContentExtension(EntityTechdocsContent),
  ],
});

const app = createApp({
  features: [convertedTechdocsPlugin],
});
```
