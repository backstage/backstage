---
'@backstage/frontend-app-api': patch
'@backstage/frontend-defaults': patch
'@backstage/frontend-plugin-api': patch
'@backstage/plugin-app': patch
---

Added experimental support for deferred plugins, which feature loaders such as the `dynamicFrontendFeaturesLoader` can provide. A deferred plugin starts out as a stand-in built from its build-time manifest, and the real plugin code is loaded the first time one of its pages is visited or one of its elements, such as a sub-page, is rendered. Loading the plugin code is retried a couple of times if it fails. A plugin with any `app.extensions` config for one of its element extensions is loaded right after the app has started, so that the config is applied. A plugin that is passed to `createApp` in `features` replaces a deferred plugin with the same ID, and a deferred plugin that a module passed to `createApp` applies to is loaded with the app. The navigation sidebar now also updates when a deferred plugin is loaded.
