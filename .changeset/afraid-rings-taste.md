---
'@backstage/plugin-catalog-import': patch
---

Flatten the options of the `CatalogImportPage` from the `options` property to the `pullRequest` property.

```diff
- <CatalogImportPage options={{ pullRequest: { disable: true } }} />
+ <CatalogImportPage pullRequest={{ disable: true }} />
```
