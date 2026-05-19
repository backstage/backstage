---
'@backstage/ui': patch
---

Updated React Aria dependencies to v1.17.0 and migrated imports from individual `@react-aria/*` and `@react-stately/*` packages to the monopackages (`react-aria`, `react-stately`). This fixes a type resolution error for `@react-types/table` that occurred in new app installations.
