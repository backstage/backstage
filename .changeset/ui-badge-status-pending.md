---
'@backstage/ui': patch
---

Added a `status` prop to `Badge` with the `info`, `success`, `warning`, and `danger` variants, which change the badge colors in the same way as `Alert`. Also added an `isPending` prop that shows a spinning loading indicator before the badge text, replacing the icon while pending.

**Affected components:** Badge
