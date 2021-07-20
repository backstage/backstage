---
'@backstage/core-components': patch
'@backstage/create-app': patch
'@backstage/plugin-catalog': patch
'@backstage/plugin-techdocs': patch
---

Improve the responsiveness of the EntityPage UI. With this the Header component should scale with the screen size & wrapping should not cause overflowing/blocking of links. Additionally enforce the Pages using the Grid Layout to use it across all screen sizes & to wrap as intended.

To benefit from the improved responsive layout, the `EntityPage` in existing Backstage applications should be updated to set the `xs` column size on each grid item in the page, as this does not default. For example:

```diff
-  <Grid item md={6}>
+  <Grid item xs={12} md={6}>
```
