---
id: internationalization
title: Internationalization (Experimental)
description: Documentation on adding internationalization to the plugin
---

## Overview

The Backstage core function provides internationalization for plugins. The underlying library is [`i18next`](https://www.i18next.com/) with some additional Backstage typescript magic for type safety with keys.

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

## For an application developer overwrite plugin messages

Step 1: Create translation resources

You should separate different translations to their own files and import them in the main file:

```ts
// packages/app/src/translations/userSettings.ts

import { createTranslationResource } from '@backstage/core-plugin-api/alpha';
import { userSettingsTranslationRef } from '@backstage/plugin-user-settings/alpha';

export const userSettingsTranslations = createTranslationResource({
  ref: userSettingsTranslationRef,
  translations: {
    zh: () => import('./userSettings-zh'),
  },
});
```

```ts
// packages/app/src/translations/userSettings-zh.ts

import { createTranslationMessages } from '@backstage/core-plugin-api/alpha';
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

It's also possible to export the list of messages directly:

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

You should change `zh` under the translations object to your local language.

Step 2: Config translations in `packages/app/src/App.tsx`

In an app you can both override the default messages, as well as register translations for additional languages:

```diff
+ import { userSettingsTranslations } from './translations/userSettings';

 const app = createApp({
+  __experimentalTranslations: {
+    availableLanguages: ['en', 'zh'],
+    resources: [userSettingsTranslations],
+  },
 })
```

Step 3: Check everything is working correctly

Go to `Settings` page, you should see change language buttons just under change theme buttons. And then switch language, you should see language had changed
