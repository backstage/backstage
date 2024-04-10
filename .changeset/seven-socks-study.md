---
'@backstage/catalog-client': patch
---

Fix the `CatalogClient::getEntities` method to only sort the resulting entities in case no `order`-parameter is provided.
