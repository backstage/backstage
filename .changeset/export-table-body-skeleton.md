---
'@backstage/ui': patch
---

Exported the `TableBodySkeleton` component as a public API for use outside of the built-in `Table` component. The component now accepts any column array whose items have an `id` property, making it compatible with custom column types.
