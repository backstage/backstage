---
'@backstage/ui': patch
---

Added `description`, `tags`, and `metadata` props to the `Header` component. The `description` prop accepts a markdown string with support for inline links. The `tags` prop renders a row of text or link items above the title. The `metadata` prop renders key-value pairs below the description. The `breadcrumbs` prop has been deprecated and will be removed in a future release.

**Affected components:** Header
