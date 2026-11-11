---
'@backstage/plugin-api-docs': patch
---

Added an experimental `./sync` entry point with the API docs config API and the "has APIs" entity card. When an app enables deferred loading of plugins, only these extensions are included in the initial app bundle, and the rest of the plugin is loaded on demand.
