---
'@backstage/plugin-app': patch
---

Expose the active plugin ID from the layout so apps can apply per-plugin theming. The app layout now wraps routed content with a `data-plugin` attribute whose value is updated on navigation. Plugin consumers can target `[data-plugin="<id>"]` selectors to style individual plugin pages without custom overrides.
