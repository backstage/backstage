---
id: extension-types
title: Frontend System Extension Types
sidebar_label: Extension Types
# prettier-ignore
description: Extension types provided by the frontend system and core features
---

> **NOTE: The new frontend system is in alpha and is only supported by a small number of plugins.**

This section covers many of the [extension types](../architecture/03-extensions.md#extension-creators) available at your disposal when building Backstage frontend plugins.

## Built-in extension types

These are the extension types provided by the Backstage frontend framework itself.

### Api - [Reference](../../reference/frontend-plugin-api.createapiextension.md)

An API extension is used to add or override [Utility API factories](../utility-apis/01-index.md) in the app. They are commonly used by plugins for both internal and shared APIs. There are also many built-in Api extensions provided by the framework that you are able to override.

### Component - [Reference](../../reference/frontend-plugin-api.createcomponentextension.md)

Components extensions are used to override the component associated with a component reference throughout the app.

### NavItem - [Reference](../../reference/frontend-plugin-api.createnavitemextension.md)

Navigation item extensions are used to provide menu items that link to different parts of the app. By default nav items are attached to the app nav extension, which by default is rendered as the left sidebar in the app.

### Page - [Reference](../../reference/frontend-plugin-api.createpageextension.md)

Page extensions provide content for a particular route in the app. By default pages are attached to the app routes extensions, which renders the root routes.

### SignInPage - [Reference](../../reference/frontend-plugin-api.createsigninpageextension.md)

Sign-in page extension have a single purpose - to implement a custom sign-in page. They are always attached to the app root extension and are rendered before the rest of the app until the user is signed in.

### Theme - [Reference](../../reference/frontend-plugin-api.createthemeextension.md)

Theme extensions provide custom themes for the app. They are always attached to the app extension and you can have any number of themes extensions installed in an app at once, letting the user choose which theme to use.

### Translation - [Reference](../../reference/frontend-plugin-api.createtranslationextension.md)

Translation extension provide custom translation messages for the app. They can be used both to override the default english messages to custom ones, as well as provide translations for additional languages.

## Core feature extension types

These are the extension types provided by the Backstage core feature plugins.

### EntityCard - [Reference](https://github.com/backstage/backstage/blob/master/plugins/catalog-react/api-report-alpha.md)

Creates entity cards to be displayed on the entity pages of the catalog plugin.

### EntityContent - [Reference](https://github.com/backstage/backstage/blob/master/plugins/catalog-react/api-report-alpha.md)

Creates entity content to be displayed on the entity pages of the catalog plugin.

### SearchResultListItem - [Reference](https://github.com/backstage/backstage/blob/master/plugins/search-react/api-report-alpha.md)

Creates search result list items for different types of search results, to be displayed in search result lists.
