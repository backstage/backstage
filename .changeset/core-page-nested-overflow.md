---
'@backstage/core-components': patch
---

The `Page` component no longer creates its own scroll container when it is rendered inside a full-height container from `@backstage/ui`, preventing nested scrollbars in apps that use the new layout primitives.
