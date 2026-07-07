---
'@backstage/backend-openapi-utils': minor
---

**BREAKING**: Removed `wrapInOpenApiTestServer`. This function redirected test traffic through the Optic `capture` proxy via the `OPTIC_PROXY` environment variable. Since the Optic dependency has been removed, this function no longer serves a purpose. Use `wrapServer` instead for OpenAPI spec validation in tests.
