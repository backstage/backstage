---
'@backstage/repo-tools': patch
---

Generated OpenAPI clients now accept an optional `AbortSignal` in the request options for every method, allowing callers to cancel individual requests or set a timeout without replacing the client's transport.
