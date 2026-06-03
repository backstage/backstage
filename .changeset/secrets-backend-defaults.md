---
'@backstage/backend-defaults': patch
---

Added a new `v2` invoke endpoint (`/.backstage/actions/v2/actions/:id/invoke`) that accepts a wrapped body format `{ input, secrets }` with secrets validation. The existing `v1` invoke endpoint remains unchanged for backward compatibility. Updated `DefaultActionsService` to use the `v2` endpoint. Updated `DefaultActionsRegistryService` to expose secrets schema in the actions list response and validate secrets on invocation.
