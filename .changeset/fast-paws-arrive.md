---
'@backstage/create-app': patch
---

Update the template to reflect the renaming of `DocsResultListItem` to `TechDocsSearchResultListItem` from `@backstage/plugin-techdocs`.

To apply this change to an existing app, make the following change to `packages/app/src/components/search/SearchPage.tsx`:

```diff
-import { DocsResultListItem } from '@backstage/plugin-techdocs';
+import { TechDocsSearchResultListItem } from '@backstage/plugin-techdocs';
```

```diff
   case 'techdocs':
     return (
-      <DocsResultListItem
+      <TechDocsSearchResultListItem
         key={document.location}
         result={document}
       />
```
