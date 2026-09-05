---
'@backstage/catalog-client': patch
---

Fix catalog entity queries to fall back to the POST endpoint when filters would produce an oversized URL, preventing `ERR_HTTP2_PROTOCOL_ERROR`/414 failures for users belonging to many groups.
