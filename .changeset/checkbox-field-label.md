---
'@backstage/ui': patch
---

The `Checkbox` component now accepts `label`, `secondaryLabel`, and `description` props, rendering a field label above the checkbox for visual consistency with other form components such as `TextField`. The existing inline label passed via `children` continues to work.
