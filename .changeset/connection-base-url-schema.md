---
'@backstage/connections': minor
---

All URL-based connection types now require `baseUrl` instead of `host`. Base URLs must use HTTP(S), retain context paths, and receive a trailing slash for resolving relative paths. Lookup and duplicate validation use the host parsed from `baseUrl`, including non-default ports. Update explicit `connections` configuration to use a full base URL; legacy `integrations` configuration is converted automatically, preserving configured base URLs and endpoints.

Returned URL-based connections expose `baseUrl` instead of `host`. The singleton `aws` connection type and its account-based lookup are unchanged. Provider-specific API URL fields remain optional and do not receive an automatic fallback.

Replaced `lookupStrategy` and `ConnectionLookupStrategy` with `getLookupIdentity` on connection type definitions. The callback returns `{ key: 'host', value }` for host matching, or `undefined` for type-only selection. Host-based and AWS query shapes are unchanged.
