---
'@backstage/create-app': patch
---

Added `EntityLinksCard` to the system `EntityPage`.

For an existing installation where you want to display the links card for entity pages of kind `system` you should make the following adjustment to `packages/app/src/components/catalog/EntityPage.tsx`

```diff
const systemPage = (
  ...
        <Grid item md={6} xs={12}>
          <EntityCatalogGraphCard variant="gridItem" height={400} />
        </Grid>
+       <Grid item md={4} xs={12}>
+         <EntityLinksCard />
+       </Grid>
-      <Grid item md={6}>
+      <Grid item md={8}>
          <EntityHasComponentsCard variant="gridItem" />
        </Grid>
  ...
);
```
