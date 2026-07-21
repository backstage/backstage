---
'@backstage/backend-openapi-utils': minor
---

`createValidatedOpenApiRouter` and `createValidatedOpenApiRouterFromGeneratedEndpointMap` now accept optional `auditor` and `logger` options. When provided, requests to operations annotated with `x-backstage-auditor` in the OpenAPI spec are audited automatically, without any further setup.

**BREAKING**: Removed the `auditorMiddlewareFactory` export. Pass `auditor` and `logger` to `createValidatedOpenApiRouter`/`createValidatedOpenApiRouterFromGeneratedEndpointMap` instead, as described above.

Also fixed a bug where an aborted client connection could leave an audit event pending indefinitely instead of being recorded as a failure, and improved the error message shown when an auditor meta pattern resolves to `NaN`.
