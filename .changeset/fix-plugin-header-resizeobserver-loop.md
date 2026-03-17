---
'@backstage/ui': patch
---

Fixed `PluginHeader` to avoid triggering `ResizeObserver loop completed with undelivered notifications` warnings when used in layouts that react to the header height, such as pages that use `FullPage`.

**Affected components:** PluginHeader
