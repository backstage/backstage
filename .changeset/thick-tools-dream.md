---
'@backstage/create-app': patch
---

Implement highlighting matching terms in search results. To enable this for an existing app, make the following changes:

```diff
// packages/app/src/components/search/SearchPage.tsx
...
-  {results.map(({ type, document }) => {
+  {results.map(({ type, document, highlight }) => {
     switch (type) {
       case 'software-catalog':
         return (
           <CatalogSearchResultListItem
             key={document.location}
             result={document}
+            highlight={highlight}
           />
         );
       case 'techdocs':
         return (
           <TechDocsSearchResultListItem
             key={document.location}
             result={document}
+            highlight={highlight}
           />
         );
       default:
         return (
           <DefaultResultListItem
             key={document.location}
             result={document}
+            highlight={highlight}
           />
         );
     }
   })}
...
```
