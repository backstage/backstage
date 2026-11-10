---
'@backstage/cli-module-build': patch
'@backstage/frontend-app-api': patch
---

Added an experimental `app.experimental.deferredPackages` option. When it is enabled together with `app.packages`, the CLI records a manifest of each detected frontend plugin at build time, and plugins that only provide pages, APIs, and extensions that render an element along with plain data, such as entity content, are loaded on demand instead of being included in the initial app bundle.
