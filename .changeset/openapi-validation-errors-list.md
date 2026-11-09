---
'@backstage/backend-openapi-utils': patch
---

Request validation failures from OpenAPI routers now include the individual validation errors on the `InputError`, with a JSON Pointer to each invalid value such as `/body/name`. The error message is unchanged.
