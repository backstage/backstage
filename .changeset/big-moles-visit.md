---
'@backstage/plugin-permission-backend': minor
---

**BREAKING**: Wrap batched requests and responses to /authorize in an envelope object. The latest version of the PermissionClient in @backstage/permission-common uses the new format - as long as the permission-backend is consumed using this client, no other changes are necessary.
