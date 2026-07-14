---
'@backstage/plugin-catalog-backend-module-msgraph': patch
---

Configuring `userGroupMember.path` together with `user.filter` is now rejected with a configuration error, as the two options are mutually exclusive. This matches the existing validation for `userGroupMember.filter` and `userGroupMember.search`.
