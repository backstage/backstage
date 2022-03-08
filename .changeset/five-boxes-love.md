---
'@backstage/plugin-permission-node': minor
---

Update `ServerPermissionClient` to match updated `PermissionAuthorizer` interface, which splits out part of the existing `authorize` method into a new `policyDecision` method. See the changelog for `@backstage/plugin-permission-common` for more details on the change.
