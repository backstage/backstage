---
'@backstage/core-app-api': patch
---

Fixed theme switching causing a full application remount by calling the theme Provider as a render function instead of a JSX component, so that React reconciles the returned element tree in place rather than unmounting and remounting the entire subtree.
