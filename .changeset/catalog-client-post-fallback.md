---
'@backstage/catalog-client': patch
---

Fix `CatalogClient.queryEntities()` to fall back to the POST endpoint when the serialized filter would produce an oversized URL, preventing `ERR_HTTP2_PROTOCOL_ERROR`/414 failures for users belonging to many groups
