---
'@backstage/plugin-catalog': minor
---

Exported `defaultCatalogTableColumnsFunc` to create a seam for defining the columns in `<CatalogTable />` of some Kinds while using the default columns for the others.
This is useful for defining the columns of a custom Kind or to redefine the columns for a built-in Kind.

```diff
// packages/app/src/App.tsx

import {
  CatalogEntityPage,
  CatalogIndexPage,
  catalogPlugin,
+  CatalogTable,
+  CatalogTableColumnsFunc,
+  defaultCatalogTableColumnsFunc,
} from '@backstage/plugin-catalog';

+ const myColumnsFunc: CatalogTableColumnsFunc = (entityListContext) => {
+   if (entityListContext.filters.kind?.value === 'MyKind') {
+     return [
+       CatalogTable.columns.createNameColumn(),
+       CatalogTable.columns.createOwnerColumn()
+     ];
+   }
+
+   return defaultCatalogTableColumnsFunc(entityListContext);
+ };

...

- <Route path="/catalog" element={<CatalogIndexPage />} />
+ <Route path="/catalog" element={<CatalogIndexPage columns={myColumnsFunc} />} />
```
