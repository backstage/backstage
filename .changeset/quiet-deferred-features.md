---
'@backstage/frontend-app-api': patch
'@backstage/frontend-defaults': patch
'@backstage/plugin-app': patch
---

Added experimental support for deferred plugins. When `app.experimental.deferredPackages` is enabled, deferrable plugins start out as stand-ins built from their build-time manifest, and the real plugin code is loaded the first time one of its pages is visited or one of its elements, such as an entity content tab, is rendered. The APIs of a deferred plugin become available once it has loaded, so they should only be used by the plugin itself, unless they are part of its sync export. A plugin package can provide a `./sync` entry point with the extensions that are needed before the plugin is first used, which are installed with the app and kept as they are when the rest of the plugin loads. Entity filters that are given as filter predicate objects keep working before a deferred plugin has loaded. Config in `app.extensions` for a deferred element is applied once the plugin has loaded, and text values that only change the data of the element, such as its title, are applied right away. If the config changes what the element shows in any other way, for example its filter, the plugin is loaded normally instead. The navigation sidebar now also updates when a deferred plugin is loaded.
