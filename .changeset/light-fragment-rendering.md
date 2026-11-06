---
'@backstage/frontend-plugin-api': patch
---

Added experimental extension fragments for embedding React content from another installed plugin without defining a custom blueprint and input. Register content with `FragmentBlueprint` and render it with `ExtensionFragment` from `@backstage/frontend-plugin-api/next`, using a namespace and optional name in `fragmentId`. Missing or disabled fragments render an optional fallback. The fragment registry is available through `extensionFragmentsApiRef` from the same `/next` entry point.
