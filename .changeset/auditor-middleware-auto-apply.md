---
'@backstage/backend-openapi-utils': minor
---

`createValidatedOpenApiRouter` and `createValidatedOpenApiRouterFromGeneratedEndpointMap` now accept optional `auditor` and `logger` options. When provided, requests to operations annotated with `x-backstage-auditor` in the OpenAPI spec are audited automatically, without any further setup. Audit event `meta` fields can be populated from templated patterns such as `{{ request.params.id }}` or `{{ response.body.id }}`, in addition to static values. An aborted client connection is now recorded as a failed audit event instead of leaving the event pending indefinitely, and the error shown when a meta pattern resolves to `NaN` now calls that out explicitly.
