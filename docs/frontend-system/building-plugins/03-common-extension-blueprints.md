---
id: common-extension-blueprints
title: Common Extension Blueprints
sidebar_label: Common Extension Blueprints
description: Extension blueprints provided by the frontend system and core features
---

> **NOTE: The new frontend system is in alpha and is only supported by a small number of plugins.**

This section covers many of the [extension blueprints](../architecture/23-extension-blueprints.md) available at your disposal when building Backstage frontend plugins.

## Extension blueprints in `@backstage/frontend-plugin-api`

These are the [extension blueprints](../architecture/23-extension-blueprints.md) provided by the Backstage frontend framework itself.

### Api - [Reference](../../reference/frontend-plugin-api.apiblueprint.md)

An API extension is used to add or override [Utility API factories](../utility-apis/01-index.md) in the app. They are commonly used by plugins for both internal and shared APIs. There are also many built-in Api extensions provided by the framework that you are able to override.

### Component - [Reference](../../reference/frontend-plugin-api.createcomponentextension.md)

Components extensions are used to override the component associated with a component reference throughout the app. This uses an extension creator function rather than a blueprint, but will likely be migrated to a blueprint in the future.

### NavItem - [Reference](../../reference/frontend-plugin-api.navitemblueprint.md)

Navigation item extensions are used to provide menu items that link to different parts of the app. By default nav items are attached to the app nav extension, which by default is rendered as the left sidebar in the app.

### Page - [Reference](../../reference/frontend-plugin-api.pageblueprint.md)

Page extensions provide content for a particular route in the app. By default pages are attached to the app routes extensions, which renders the root routes.

### SignInPage - [Reference](../../reference/frontend-plugin-api.signinpageblueprint.md)

Sign-in page extension have a single purpose - to implement a custom sign-in page. They are always attached to the app root extension and are rendered before the rest of the app until the user is signed in.

### Theme - [Reference](../../reference/frontend-plugin-api.themeblueprint.md)

Theme extensions provide custom themes for the app. They are always attached to the app extension and you can have any number of themes extensions installed in an app at once, letting the user choose which theme to use.

### Icons - [Reference](../../reference/frontend-plugin-api.iconbundleblueprint.md)

Icon bundle extensions provide the ability to replace or provide new icons to the app. You can use the above blueprint to make new extension instances which can be installed into the app.

### Translation - [Reference](../../reference/frontend-plugin-api.translationblueprint.md)

Translation extension provide custom translation messages for the app. They can be used both to override the default english messages to custom ones, as well as provide translations for additional languages.

## Extension blueprints in `@backstage/plugin-catalog-react/alpha`

These are the [extension blueprints](../architecture/23-extension-blueprints.md) provided by the Catalog plugin.

### EntityCard - [Example](https://github.com/backstage/backstage/blob/75e79518eafc6e6eb55585f166667418419662de/plugins/org/src/alpha.tsx#L27-L36)

Creates entity cards to be displayed on the entity pages of the catalog plugin. Exported as `EntityCardBlueprint`.

Avoid using `convertLegacyEntityCardExtension` from `@backstage/core-compat-api` to convert legacy entity card extensions to the new system. Instead, use the `EntityCardBlueprint` directly. The legacy converter is only intended to help adapt 3rd party plugins that you don't control, and doesn't produce as good results as using the blueprint directly.

### EntityContent - [Example](https://github.com/backstage/backstage/blob/cd71065a02bed740011daee96a865108a785dff6/plugins/kubernetes/src/alpha/entityContents.tsx#L22-L34)

Creates entity content to be displayed on the entity pages of the catalog plugin. Exported as `EntityContentBlueprint`.

Avoid using `convertLegacyEntityContentExtension` from `@backstage/core-compat-api` to convert legacy entity content extensions to the new system. Instead, use the `EntityContentBlueprint` directly. The legacy converter is only intended to help adapt 3rd party plugins that you don't control, and doesn't produce as good results as using the blueprint directly.

## Extension blueprints in `@backstage/plugin-search-react/alpha`

These are the [extension blueprints](../architecture/23-extension-blueprints.md) provided by the Search plugin.

### SearchResultListItem - [Example](https://github.com/backstage/backstage/blob/8cb9a85596a5417a004811ffa429527b17ce9b72/plugins/catalog/src/alpha/searchResultItems.tsx#L19-L27)

Creates search result list items for different types of search results, to be displayed in search result lists. Exported as `SearchResultListItemBlueprint`.
