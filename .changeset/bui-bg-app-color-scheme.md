---
'@backstage/ui': patch
---

The `--bui-bg-app` token now follows the page's `color-scheme` until a theme mode is set. While the app loads, the page background then matches a dark theme instead of showing as light. Browsers without `light-dark()` support keep the light value until the theme mode is set, as before.
