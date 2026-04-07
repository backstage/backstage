---
'@backstage/ui': patch
---

Added automatic active tab detection to the Header component. When `activeTabId` is omitted, the active tab is now auto-detected from the current route using `matchRoutes`. Pass an explicit `activeTabId` to override, or `null` for no active tab.

**Affected components:** Header
