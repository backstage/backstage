---
id: internationalization
title: Internationalization
description: Documentation on adding internationalization to plugins and apps
---

## Overview

The Backstage core function provides internationalization for plugins and apps. The underlying library is [`i18next`](https://www.i18next.com/) with some additional Backstage typescript magic for type safety with keys.

## For a plugin developer

When you are creating your plugin, you have the possibility to use `createTranslationRef` to define all messages for your plugin. For example:

```ts
import { createTranslationRef } from '@backstage/core-plugin-api/alpha';

/** @alpha */
export const myPluginTranslationRef = createTranslationRef({
  id: 'plugin.my-plugin',
  messages: {
    indexPage: {
      title: 'All your components',
      createButtonTitle: 'Create new component',
    },
    entityPage: {
      notFound: 'Entity not found',
    },
  },
});
```

And then use these messages in your components like:

```tsx
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

const { t } = useTranslationRef(myPluginTranslationRef);

return (
  <PageHeader title={t('indexPage.title')}>
    <Button onClick={handleCreateComponent}>
      {t('indexPage.createButtonTitle')}
    </Button>
  </PageHeader>
);
```

You will see how the initial dictionary structure and nesting get converted into dot notation, so we encourage `camelCase` in key names and lean on the nesting structure to separate keys.

### Guidelines for `i18n` messages and keys

The API for `i18n` messages and keys can be pretty tricky to get right, as it's a pretty flexible API. We've put together some guidelines to help you get started that encourage good practices when thinking about translating plugins:

#### Key names

When defining messages it is recommended to use a nested structure that represents the semantic hierarchy in your translations. This allows for better organization and understanding of the structure. For example:

```ts
export const myPluginTranslationRef = createTranslationRef({
  id: 'plugin.my-plugin',
  messages: {
    dashboardPage: {
      title: 'All your components',
      subtitle: 'Create new component',
      widgets: {
        weather: {
          title: 'Weather',
          description: 'Shows the weather',
        },
        calendar: {
          title: 'Calendar',
          description: 'Shows the calendar',
        },
      },
    },
    entityPage: {
      notFound: 'Entity not found',
    },
  },
});
```

Think about the semantic placement of content rather than the text content itself. Group related translations under a common prefix, and use nesting to represent relationships between different parts of your application. It's good to start grouping under extensions, page sections, or visual scopes and experiences.

Translations should avoid using their own text content as key where possible, as this can lead to confusion if the translation changes. Instead prefer to use keys that describe the location or usage of the text.

#### Common Key names

This list is intended to grow over time, but below are some examples of common key names and patterns that we encourage you to use where possible:

- `${page}.title`
- `${page}.subtitle`
- `${page}.description`

- `${page}.header.title`

#### Key reuse

Reusing the same key in multiple places is discouraged. This helps prevent ambiguity, and instead keeps the usage of each key as clear as possible. Consider creating duplicate keys that are grouped under a semantic section instead.

#### Flat keys

Avoid a flat key structure at the root level, as it can lead to naming conflicts and make the translation file harder to manage and change evolve over time. Instead, group translations under a common prefix.

```ts
export const myPluginTranslationRef = createTranslationRef({
  id: 'plugin.my-plugin',
  messages: {
    // this is BAD
    title: 'My page',
    subtitle: 'My subtitle',
    // this is GOOD
    dashboardPage: {
      header: {
        title: 'All your components',
        subtitle: 'Create new component',
      },
    },
  },
});
```

#### Plurals

The `i18next` library, which is used as the underlying implementation, has built-in support for pluralization. You can use this feature as is described in [the documentation](https://www.i18next.com/translation-function/plurals).

We encourage you to use this feature and avoid creating different key prefixes for pluralized content. For example:

```ts
export const myPluginTranslationRef = createTranslationRef({
  id: 'plugin.my-plugin',
  messages: {
    dashboardPage: {
      title: 'All your components',
      subtitle: 'Create new component',
      cards: {
        title_one: 'You have one card',
        title_two: 'You have two cards',
        title_other: 'You have many cards ({{count}})',
      },
    },
    entityPage: {
      notFound: 'Entity not found',
    },
  },
});
```

#### JSX Elements

The translation API supports interpolation of JSX elements by passing them directly as values to the translation function. If any of the provided interpolation values are JSX elements, the translation function will return a JSX element instead of a string.

For example, you might define the following messages:

```ts title="define the message"
export const myPluginTranslationRef = createTranslationRef({
  id: 'plugin.my-plugin',
  messages: {
    entityPage: {
      redirect: {
        message: 'The entity you are looking for has been moved to {{link}}.',
        link: 'new location',
      },
    },
  },
});
```

Which can be used within a component like this:

```tsx title="use within a component"
const { t } = useTranslationRef(myPluginTranslationRef);

return (
  <div>
    {t('entityPage.redirect.message', {
      link: <a href="/new-location">{t('entityPage.redirect.link')}</a>,
    })}
  </div>
);
```

The return type of the outer `t` function will be a `JSX.Element`, with the underlying value being a React fragment of the different parts of the message.

## For an application developer

As an app developer you can both override the default English messages of any plugin, and provide translations for additional languages.

### Overriding messages

To customize specific messages without adding new languages, create a translation resource that overrides the default English messages:

```ts
// packages/app/src/translations/catalog.ts

import { createTranslationResource } from '@backstage/frontend-plugin-api';
import { catalogTranslationRef } from '@backstage/plugin-catalog/alpha';

export const catalogTranslations = createTranslationResource({
  ref: catalogTranslationRef,
  translations: {
    en: () =>
      Promise.resolve({
        default: {
          'indexPage.title': 'Service directory',
          'indexPage.createButtonTitle': 'Register new service',
        },
      }),
  },
});
```

Then register it in your app:

```diff
+ import { catalogTranslations } from './translations/catalog';

 const app = createApp({
+  __experimentalTranslations: {
+    resources: [catalogTranslations],
+  },
 })
```

You only need to include the keys you want to override — any missing keys fall back to the plugin's defaults.

### Adding language translations

To add support for additional languages, create translation resources with lazy-loaded message files for each language:

```ts
// packages/app/src/translations/userSettings.ts

import { createTranslationResource } from '@backstage/frontend-plugin-api';
import { userSettingsTranslationRef } from '@backstage/plugin-user-settings/alpha';

export const userSettingsTranslations = createTranslationResource({
  ref: userSettingsTranslationRef,
  translations: {
    zh: () => import('./userSettings-zh'),
  },
});
```

The translation messages can be defined using `createTranslationMessages` for type safety:

```ts
// packages/app/src/translations/userSettings-zh.ts

import { createTranslationMessages } from '@backstage/frontend-plugin-api';
import { userSettingsTranslationRef } from '@backstage/plugin-user-settings/alpha';

const zh = createTranslationMessages({
  ref: userSettingsTranslationRef,
  full: false, // False means that this is a partial translation
  messages: {
    'languageToggle.title': '语言',
    'languageToggle.select': '选择{{language}}',
  },
});

export default zh;
```

Or as a plain object export:

```ts
// packages/app/src/translations/userSettings-zh.ts
export default {
  'languageToggle.title': '语言',
  'languageToggle.select': '选择{{language}}',
  'languageToggle.description': '切换语言',
  'themeToggle.title': '主题',
  'themeToggle.description': '切换主题',
  'themeToggle.select': '选择{{theme}}',
  'themeToggle.selectAuto': '选择自动主题',
  'themeToggle.names.auto': '自动',
  'themeToggle.names.dark': '暗黑',
  'themeToggle.names.light': '明亮',
};
```

Register it with the available languages declared:

```diff
+ import { userSettingsTranslations } from './translations/userSettings';

 const app = createApp({
+  __experimentalTranslations: {
+    availableLanguages: ['en', 'zh'],
+    resources: [userSettingsTranslations],
+  },
 })
```

Go to the Settings page — you should see language switching buttons. Switch languages to verify your translations are loaded correctly.

### Using the CLI for full translation workflows

When translating your app to other languages at scale — especially when working with translation management systems (TMS) like Smartling, Crowdin, or Lokalise — the Backstage CLI provides `translations export` and `translations import` commands that automate the extraction and wiring of translation messages across all your plugin dependencies.

#### Exporting default messages

From your app package directory (e.g. `packages/app`), run:

```bash
yarn backstage-cli translations export
```

This scans all frontend plugin dependencies (including transitive ones) for `TranslationRef` definitions and writes their default English messages as JSON files:

```text
translations/
  manifest.json
  messages/
    catalog.en.json
    org.en.json
    scaffolder.en.json
    ...
```

Each `.en.json` file contains the flattened message keys and their default values:

```json
{
  "indexPage.title": "All your components",
  "indexPage.createButtonTitle": "Create new component",
  "entityPage.notFound": "Entity not found"
}
```

#### Creating translations

Copy the exported files and translate them for your target languages:

```bash
cp translations/messages/catalog.en.json translations/messages/catalog.zh.json
```

Then edit `catalog.zh.json` with the translated strings. You only need to include the keys you want to translate — missing keys fall back to the English defaults at runtime.

#### Generating wiring code

Once you have translated files in place, run:

```bash
yarn backstage-cli translations import
```

This generates a TypeScript module at `src/translations/resources.ts` that wires everything together:

```ts
// This file is auto-generated by backstage-cli translations import
// Do not edit manually.

import { createTranslationResource } from '@backstage/frontend-plugin-api';
import { catalogTranslationRef } from '@backstage/plugin-catalog/alpha';

export default [
  createTranslationResource({
    ref: catalogTranslationRef,
    translations: {
      zh: () => import('../../translations/messages/catalog.zh.json'),
    },
  }),
];
```

Import the generated resources in your app:

```ts
import translationResources from './translations/resources';

const app = createApp({
  __experimentalTranslations: {
    availableLanguages: ['en', 'zh'],
    resources: translationResources,
  },
});
```

#### Custom file patterns

By default, message files use the pattern `messages/{id}.{lang}.json` (e.g. `messages/catalog.en.json`). You can change this with the `--pattern` option:

```bash
yarn backstage-cli translations export --pattern '{lang}/{id}.json'
```

This produces a directory structure grouped by language instead:

```text
translations/en/catalog.json
translations/zh/catalog.json
```

The pattern is stored in the manifest, so the `import` command automatically uses the same layout.

#### Integration with a TMS

The exported JSON files are standard key-value pairs compatible with most translation management systems. A typical workflow looks like:

1. Run `translations export` to generate the source English files
2. Upload the `.en.json` files to your TMS
3. Download the translated files from your TMS into the `messages/` directory
4. Run `translations import` to regenerate the wiring code

For full command reference, see the [CLI commands documentation](../tooling/cli/03-commands.md#translations-export).
