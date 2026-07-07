---
'@backstage/ui': patch
---

Add `breadcrumbs` prop & breadcrumbs to `PluginHeader`. When passed `breadcrumbs`, `PluginHeader` renders a `nav` with breadcrumbs & visually hides the plugin title.

These breadcrumbs:

- Collapses middle segments if 5 or more segments
- Shows tooltip if text is truncated

**Affected components:** PluginHeader
