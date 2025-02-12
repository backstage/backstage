---
'@backstage/create-app': patch
---

Enable `catalog.useUrlReadersSearch` configuration by default in newly created Backstage installations.

This parameter makes `UrlReaderProcessor` always use the search method.
New adopters are encouraged to enable it as this behavior will be the default in a future release.
