---
'@backstage/create-app': patch
---

A `label` prop was added to `<SearchFilter.* />` components in order to allow
user-friendly label strings (as well as the option to omit a label). In order
to maintain labels on your existing filters, add a `label` prop to them in your
`SearchPage.tsx`.

```diff
--- a/packages/app/src/components/search/SearchPage.tsx
+++ b/packages/app/src/components/search/SearchPage.tsx
@@ -96,11 +96,13 @@ const SearchPage = () => {
               )}
               <SearchFilter.Select
                 className={classes.filter}
+                label="Kind"
                 name="kind"
                 values={['Component', 'Template']}
               />
               <SearchFilter.Checkbox
                 className={classes.filter}
+                label="Lifecycle"
                 name="lifecycle"
                 values={['experimental', 'production']}
               />
```
