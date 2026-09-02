---
'@backstage/plugin-catalog-backend': patch
---

The `POST /validate-entity` endpoint's request body is now documented in the OpenAPI spec using a generic input shape, rather than being excluded from OpenAPI request validation entirely. This is an internal cleanup with no change to the endpoint's runtime behavior or error responses.
