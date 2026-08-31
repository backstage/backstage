---
'@backstage/ui': patch
---

Widened the `title` prop on `PluginHeader`, and the `label` prop on its tabs and breadcrumb entries, from `string` to `ReactNode`, so callers can render these as translated or otherwise dynamic content instead of a fixed string.
