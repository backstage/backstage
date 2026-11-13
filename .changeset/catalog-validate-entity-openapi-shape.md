---
'@backstage/plugin-catalog-backend': patch
---

The `POST /validate-entity` endpoint is now covered by OpenAPI request validation. Requests that fail validation, such as a malformed body, still receive a `400` response in the same `{ errors: [...] }` shape as before, although the error message text now comes from the OpenAPI validator.
