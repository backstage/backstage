---
'@backstage/ui': patch
---

Fixed tab `matchStrategy` matching to ignore query parameters and hash fragments in tab `href` values. Previously, tabs with query params in their `href` (e.g., `/page?group=foo`) would never show as active since matching compared the full `href` string against `location.pathname` which never includes query params.

**Affected components:** Tabs, PluginHeader
