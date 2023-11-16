---
'@backstage/plugin-catalog': patch
---

Added experimental pagination support to `CatalogIndexPage`

CatalogIndexPage now offers an optional pagination feature, designed to accommodate adopters managing extensive catalogs. This new capability allows for better handling of large amounts of data.

To activate the pagination mode, simply update your configuration as follows:

```diff
  catalog:
+   experimentalPagination: true
```
