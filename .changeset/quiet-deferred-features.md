---
'@backstage/frontend-app-api': patch
'@backstage/frontend-defaults': patch
'@backstage/frontend-plugin-api': patch
'@backstage/plugin-app': patch
---

Added experimental support for deferred plugins, which feature loaders such as the `dynamicFrontendFeaturesLoader` can provide. A deferred plugin starts out as a stand-in built from its build-time manifest, and the real plugin code is loaded the first time one of its pages is visited or one of its elements, such as a sub-page, is rendered. Loading the plugin code is retried a couple of times if it fails. The stand-in of an element applies the `app.extensions` config that the factory of its blueprint outputs as is, and config that only affects the element is applied once the plugin is loaded. A plugin with any other `app.extensions` config for one of its element extensions is loaded right after the app has started, so that the config is applied. The utility APIs of a deferred plugin are registered as lazy APIs that load the plugin the first time they are used. A plugin that is passed to `createApp` in `features` replaces a deferred plugin with the same ID, and a deferred plugin that a module passed to `createApp` applies to is loaded with the app. The navigation sidebar now also updates when a deferred plugin is loaded.
