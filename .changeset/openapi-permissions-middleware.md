---
'@backstage/backend-openapi-utils': minor
---

The OpenAPI router can now enforce authorization declared directly in the spec. Add an `x-backstage-permissions` extension to an operation to require a permission before its handler runs, and create the router with the permission services (`permissions`, `permissionsRegistry`, `httpAuth`, and `logger`) to turn enforcement on. The extension supports resource permissions (via a `resourceRef` read from a path or query parameter), custom responses when access is denied, and opting an operation out of automatic enforcement.

Every permission referenced by an `x-backstage-permissions` extension must be registered with the permissions registry before the router is created — basic permissions via `addPermissions` and resource permissions via `addResourceType`. This is stricter than authorizing in code, where basic permissions did not previously need to be registered. Referencing a permission that is not registered now fails when the router is created, rather than on the first request to the affected operation. See the package README for details.
