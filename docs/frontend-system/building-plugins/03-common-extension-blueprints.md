---
id: common-extension-blueprints
title: Common Extension Blueprints
sidebar_label: Common Extension Blueprints
description: Extension blueprints provided by the frontend system and core features
---

This section covers many of the [extension blueprints](../architecture/23-extension-blueprints.md) available at your disposal when building Backstage frontend plugins.

## Extension blueprints in `@backstage/frontend-plugin-api`

These are the [extension blueprints](../architecture/23-extension-blueprints.md) provided by the Backstage frontend framework itself.

### Api - [Reference](https://backstage.io/api/stable/variables/_backstage_frontend-plugin-api.ApiBlueprint.html)

An API extension is used to add or override [Utility API factories](../utility-apis/01-index.md) in the app. They are commonly used by plugins for both internal and shared APIs. There are also many built-in Api extensions provided by the framework that you are able to override.

### NavItem - [Reference](https://backstage.io/api/stable/variables/_backstage_frontend-plugin-api.NavItemBlueprint.html)

Navigation item extensions are used to provide menu items that link to different parts of the app. By default nav items are attached to the app nav extension, which by default is rendered as the left sidebar in the app.

### Page - [Reference](https://backstage.io/api/stable/variables/_backstage_frontend-plugin-api.PageBlueprint.html)

Page extensions provide content for a particular route in the app. By default pages are attached to the app routes extensions, which renders the root routes.

## Extension blueprints in `@backstage/frontend-plugin-api/alpha`

### Plugin Wrapper - [Reference](https://backstage.io/api/stable/variables/_backstage_frontend-plugin-api.packages-frontend-plugin-api_src_alpha.PluginWrapperBlueprint.html)

Plugin wrappers allow you to install components that will wrap all elements rendered as part of a plugin. This can be useful if you need to add a global provider, for example for a query client. The provided wrapper will be rendered as separate elements for each wrapped plugin element, so be sure to use a central store like a [Utility API](../utility-apis/01-index.md) if you want to share state between wrapper instances.

## Extension blueprints in `@backstage/plugin-app-react`

### SignInPage - [Reference](https://backstage.io/api/stable/variables/_backstage_frontend-plugin-api.SignInPageBlueprint.html)

Sign-in page extension have a single purpose - to implement a custom sign-in page. They are always attached to the app root extension and are rendered before the rest of the app until the user is signed in.

### SwappableComponent - [Reference](https://backstage.io/api/stable/variables/_backstage_frontend-plugin-api.SwappableComponentBlueprint.html)

Swappable Components are extensions that are used to replace the implementations of components in the app and plugins.

### Theme - [Reference](https://backstage.io/api/stable/variables/_backstage_frontend-plugin-api.ThemeBlueprint.html)

Theme extensions provide custom themes for the app. They are always attached to the app extension and you can have any number of themes extensions installed in an app at once, letting the user choose which theme to use.

### Icons - [Reference](https://backstage.io/api/stable/variables/_backstage_frontend-plugin-api.IconBundleBlueprint.html)

Icon bundle extensions provide the ability to replace or provide new icons to the app. You can use the above blueprint to make new extension instances which can be installed into the app.

### Translation - [Reference](https://backstage.io/api/stable/variables/_backstage_frontend-plugin-api.TranslationBlueprint.html)

Translation extension provide custom translation messages for the app. They can be used both to override the default english messages to custom ones, as well as provide translations for additional languages.

### NavContent - [Reference](https://backstage.io/api/stable/variables/_backstage_frontend-plugin-api.NavContentBlueprint.html)

Nav content extensions allow you to replace the entire navbar with your own component. They are always attached to the app nav extension.

### Router - [Reference](https://backstage.io/api/stable/variables/_backstage_frontend-plugin-api.RouterBlueprint.html)

Router extensions allow you to replace the router component used by the app. They are always attached to the app root extension.

## Extension blueprints in `@backstage/plugin-catalog-react/alpha`

These are the [extension blueprints](../architecture/23-extension-blueprints.md) provided by the Catalog plugin.

### EntityCard - [Example](https://github.com/backstage/backstage/blob/75e79518eafc6e6eb55585f166667418419662de/plugins/org/src/alpha.tsx#L27-L36)

Creates entity cards to be displayed on the entity pages of the catalog plugin. Exported as `EntityCardBlueprint`.

Avoid using `convertLegacyEntityCardExtension` from `@backstage/core-compat-api` to convert legacy entity card extensions to the new system. Instead, use the `EntityCardBlueprint` directly. The legacy converter is only intended to help adapt 3rd party plugins that you don't control, and doesn't produce as good results as using the blueprint directly.

### EntityContent - [Example](https://github.com/backstage/backstage/blob/cd71065a02bed740011daee96a865108a785dff6/plugins/kubernetes/src/alpha/entityContents.tsx#L22-L34)

Creates entity content to be displayed on the entity pages of the catalog plugin. Exported as `EntityContentBlueprint`.

Supports optional params such as `group` and `icon` to:

- group: string | false — associates the content with a tab group on the entity page (for example "overview", "quality", "deployment", or any custom id). You can override or disable this per-installation via app-config using `app.extensions[...].config.group`, where `false` removes the grouping.
- icon: string — sets the tab icon. Note: when providing a string, the icon is looked up via the app's IconsApi; make sure icon bundles are enabled/installed in your app (see the Icons blueprint reference above) so that the icon id you use is available.

To render icons in the entity page tabs, the page must also have icons enabled via app configuration. Set `showNavItemIcons: true` on the catalog entity page config (created via `page:catalog/entity`). Example:

```yaml
app:
  extensions:
    # Entity page
    - page:catalog/entity:
        config:
          # Enable tab- and group-icons
          showNavItemIcons: true
          # Optionally override default groups and their icons
          groups:
            - overview:
                title: Overview
                icon: dashboard
            - documentation:
                title: Docs
                icon: description
```

Avoid using `convertLegacyEntityContentExtension` from `@backstage/core-compat-api` to convert legacy entity content extensions to the new system. Instead, use the `EntityContentBlueprint` directly. The legacy converter is only intended to help adapt 3rd party plugins that you don't control, and doesn't produce as good results as using the blueprint directly.

## Extension blueprints in `@backstage/plugin-search-react/alpha`

These are the [extension blueprints](../architecture/23-extension-blueprints.md) provided by the Search plugin.

### SearchResultListItem - [Example](https://github.com/backstage/backstage/blob/8cb9a85596a5417a004811ffa429527b17ce9b72/plugins/catalog/src/alpha/searchResultItems.tsx#L19-L27)

Creates search result list items for different types of search results, to be displayed in search result lists. Exported as `SearchResultListItemBlueprint`.
