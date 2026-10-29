---
'@backstage/frontend-plugin-api': patch
'@backstage/plugin-app': patch
---

Added alpha extension fragments for embedding React content from another installed plugin without defining a custom blueprint and input. Register content with `FragmentBlueprint` and render it with `ExtensionFragment` from `@backstage/frontend-plugin-api/alpha`, using a namespace and optional name in `fragmentId`. Missing or disabled fragments render an optional fallback. The fragment registry is available through `extensionFragmentsApiRef` from the same alpha entry point.
