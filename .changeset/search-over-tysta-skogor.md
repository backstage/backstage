---
'@backstage/create-app': patch
---

The `<SearchType />` filter in the composed `SearchPage.tsx` was replaced with the `<SearchType.Accordion />` variant.

This is an entirely optional change; if you wish to display a control surface for search `types` as a single-select accordion (as opposed to the current multi-select of checkboxes), you can make the following (or similar) changes to your search page layout:

```diff
--- a/packages/app/src/components/search/SearchPage.tsx
+++ b/packages/app/src/components/search/SearchPage.tsx
@@ -11,7 +11,7 @@ import {
   SearchType,
   DefaultResultListItem,
 } from '@backstage/plugin-search';
-import { Content, Header, Page } from '@backstage/core-components';
+import { CatalogIcon, Content, DocsIcon, Header, Page } from '@backstage/core-components';

 const useStyles = makeStyles((theme: Theme) => ({
   bar: {
@@ -19,6 +19,7 @@ const useStyles = makeStyles((theme: Theme) => ({
   },
   filters: {
     padding: theme.spacing(2),
+    marginTop: theme.spacing(2),
   },
   filter: {
     '& + &': {
@@ -41,12 +42,23 @@ const SearchPage = () => {
             </Paper>
           </Grid>
           <Grid item xs={3}>
+            <SearchType.Accordion
+              name="Result Type"
+              defaultValue="software-catalog"
+              types={[
+                {
+                  value: 'software-catalog',
+                  name: 'Software Catalog',
+                  icon: <CatalogIcon />,
+                },
+                {
+                  value: 'techdocs',
+                  name: 'Documentation',
+                  icon: <DocsIcon />,
+                },
+              ]}
+            />
             <Paper className={classes.filters}>
-              <SearchType
-                values={['techdocs', 'software-catalog']}
-                name="type"
-                defaultValue="software-catalog"
-              />
               <SearchFilter.Select
                 className={classes.filter}
                 name="kind"
```
