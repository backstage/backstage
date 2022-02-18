---
'@backstage/create-app': patch
---

Update the template to reflect the renaming of `CatalogResultListItem` to `CatalogSearchResultListItem` from `@backstage/plugin-catalog`.

To apply this change to an existing app, make the following change to `packages/app/src/components/search/SearchPage.tsx`:

```diff
-import { CatalogResultListItem } from '@backstage/plugin-catalog';
+import { CatalogSearchResultListItem } from '@backstage/plugin-catalog';
```

```diff
   case 'software-catalog':
     return (
-      <CatalogResultListItem
+      <CatalogSearchResultListItem
         key={document.location}
         result={document}
       />
```
