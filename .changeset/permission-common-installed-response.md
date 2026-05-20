---
'@backstage/plugin-permission-common': patch
---

Added a new `authorizeByName` method on `PermissionClient` and the matching `AuthorizeByNamePermissionRequest`, `AuthorizeByNameRequest`, and `AuthorizeByNameResponse` types. This lets callers that hold a permission name but not the full `Permission` shape — such as the frontend predicate loader — authorize through the `POST /authorize/by-name` endpoint without first fetching the registered permission. If the connected permission backend predates this route (returns 404), `authorizeByName` transparently falls back to `/authorize` with a fabricated `{ type: 'basic', attributes: {} }` permission per name.
