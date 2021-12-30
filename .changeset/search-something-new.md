---
'@backstage/create-app': patch
---

An example instance of the new `<SearchFilter.Autocomplete />` was added to the composed `SearchPage.tsx`, allowing searches bound to the `techdocs` type to be filtered by entity name.

This is an entirely optional change; if you wish to adopt it, you can make the following (or similar) changes to your search page layout:

```diff
--- a/packages/app/src/components/search/SearchPage.tsx
+++ b/packages/app/src/components/search/SearchPage.tsx
@@ -2,6 +2,10 @@ import React from 'react';
 import { makeStyles, Theme, Grid, List, Paper } from '@material-ui/core';

 import { CatalogResultListItem } from '@backstage/plugin-catalog';
+import {
+  catalogApiRef,
+  CATALOG_FILTER_EXISTS,
+} from '@backstage/plugin-catalog-react';
 import { DocsResultListItem } from '@backstage/plugin-techdocs';

 import {
@@ -10,6 +14,7 @@ import {
   SearchResult,
   SearchType,
   DefaultResultListItem,
+  useSearch,
 } from '@backstage/plugin-search';
 import {
   CatalogIcon,
@@ -18,6 +23,7 @@ import {
   Header,
   Page,
 } from '@backstage/core-components';
+import { useApi } from '@backstage/core-plugin-api';

 const useStyles = makeStyles((theme: Theme) => ({
   bar: {
@@ -36,6 +42,8 @@ const useStyles = makeStyles((theme: Theme) => ({

 const SearchPage = () => {
   const classes = useStyles();
+  const { types } = useSearch();
+  const catalogApi = useApi(catalogApiRef);

   return (
     <Page themeId="home">
@@ -65,6 +73,27 @@ const SearchPage = () => {
               ]}
             />
             <Paper className={classes.filters}>
+              {types.includes('techdocs') && (
+                <SearchFilter.Autocomplete
+                  className={classes.filter}
+                  label="Entity"
+                  name="name"
+                  asyncValues={async partial => {
+                    // Return a list of entitis which are documented.
+                    const { items } = await catalogApi.getEntities({
+                      fields: ['metadata.name'],
+                      filter: {
+                        'metadata.annotations.backstage.io/techdocs-ref':
+                          CATALOG_FILTER_EXISTS,
+                      },
+                    });
+
+                    return items
+                      .map(entity => entity.metadata.name)
+                      .filter(name => name.includes(partial));
+                  }}
+                />
+              )}
               <SearchFilter.Select
                 className={classes.filter}
                 name="kind"
```
