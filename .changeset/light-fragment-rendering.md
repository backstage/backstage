---
'@backstage/frontend-plugin-api': patch
'@backstage/plugin-app': patch
---

Added extension fragments for embedding React content from another installed plugin without defining a custom blueprint and input. Register content with `FragmentBlueprint` and render it with `ExtensionFragment`, using a namespace and optional name. Missing or disabled fragments render an optional fallback. The fragment registry is available through `coreApis.extensionFragments` after the app session boundary.
