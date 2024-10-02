---
'@backstage/cli': patch
---

Added functionality to the prepack script that will append the default export type for entry points to the `exports` object before publishing. This is to help with identifying the declarative integration points for plugins without needing to fetch or run the plugins first.
