---
'@backstage/plugin-api-docs': patch
---

Added an experimental `./sync` entry point, which holds the API docs config API and the "has APIs" entity card. It lets the rest of the plugin be deferred when the app enables `app.experimental.deferredPackages`.
