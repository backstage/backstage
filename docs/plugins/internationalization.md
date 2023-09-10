---
id: internationalization
title: Internationalization (Experimental)
description: Documentation on adding internationalization to the plugin
---

## Overview

The Backstage core function provides internationalization for plugins

## For a plugin developer

When you are creating your plugin, you have the possibility to use `createTranslationRef` to define all messages for your plugin. For example

```typescript jsx
import { createTranslationRef } from '@backstage/core-plugin-api/alpha';

/** @alpha */
export const userSettingsTranslationRef = createTranslationRef({
  id: 'user-settings',
  messages: {
    language: 'Language',
    change_the_language: 'Change the language',
  },
});
```

And the using this messages in your components like:

```typescript jsx
const t = useTranslationRef(userSettingsTranslationRef);

return (
  <ListItemText
    className={classes.listItemText}
    primary={t('language')}
    secondary={t('change_the_language')}
  />
);
```

## For an application developer overwrite plugin messages

```diff typescript jsx
const app = createApp({
+  __experimentalI18n: {
+    supportedLanguages: ['zh', 'en'],
+    messages: [
+      createTranslationResource({
+        ref: userSettingsTranslationRef,
+        messages: {
+          zh: {
+            select_lng: '选择中文-app',
+          },
+        },
+      }),
+    ],
+  },
  ...
})
```
