---
'@backstage/catalog-client': patch
---

The `getEntities` method now uses the `POST /entities/by-query` endpoint instead of `GET /entities`, avoiding request URL size limits when filters or other parameters are large. When the legacy `after` cursor parameter is provided, the old `GET /entities` endpoint is still used as a fallback.
