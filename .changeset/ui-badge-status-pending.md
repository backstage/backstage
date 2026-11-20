---
'@backstage/ui': patch
---

Added a `status` prop to `Badge` with the `info`, `success`, `warning`, and `danger` variants, which change the badge colors and show the same status icons as `Alert`. A custom `icon` replaces the status icon, and `icon={false}` hides it. Also added an `isPending` prop that shows a spinning loading indicator after the badge text.

**Affected components:** Badge
