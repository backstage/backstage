---
'@backstage/ui': patch
---

Fixed the active tab indicator disappearing in non-routed (uncontrolled) Tabs. The indicator opacity is now only hidden when `selectedKey` is explicitly empty (routed tabs with no matching route), rather than when it is `null` or `undefined` (uncontrolled mode where React Aria manages selection internally).
