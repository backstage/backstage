---
'@backstage/cli-module-build': patch
'@backstage/frontend-app-api': patch
---

Added an experimental `app.experimental.deferredPackages` option. When it is enabled together with `app.packages`, the CLI records a manifest of each detected frontend plugin at build time. Plugins that only provide pages, APIs, and extensions that render an element along with plain data, such as entity cards and entity content, are loaded on demand instead of being included in the initial app bundle. A plugin that is configured in `app.extensions` for any of its element extensions is not deferred, and neither is a plugin that is imported directly in the app. If a plugin package has a `./sync` entry point, the CLI includes it in the initial app bundle and defers the rest of the plugin. The CLI prints which plugins are deferred and why the others are not.
