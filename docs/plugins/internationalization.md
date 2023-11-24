---
id: internationalization
title: Internationalization (Experimental)
description: Documentation on adding internationalization to the plugin
---

## Overview

The Backstage core function provides internationalization for plugins

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

And the using this messages in your components like:

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

## For an application developer overwrite plugin messages

In an app you can both override the default messages, as well as register translations for additional languages:

```diff
 const app = createApp({
+  __experimentalTranslations: {
+    availableLanguages: ['en', 'zh'],
+    resources: [
+      createTranslationMessages({
+        ref: myPluginTranslationRef,
+        messages: {
+          'indexPage.createButtonTitle': 'Create new entity',
+        },
+      }),
+      createTranslationResource({
+        ref: myPluginTranslationRef,
+        messages: {
+          zh: () => import('./translations/zh'),
+        },
+      }),
+    ],
+  },
 })
```
