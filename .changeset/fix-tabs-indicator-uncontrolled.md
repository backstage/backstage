---
'@backstage/ui': patch
---

Fixed the active tab indicator disappearing in non-routed (uncontrolled) Tabs on initial render. The indicator is now also correctly hidden when transitioning from a selected tab back to no selection in controlled mode.

**Affected components:** Tabs
