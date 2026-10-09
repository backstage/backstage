---
'@backstage/plugin-permission-backend': patch
---

Preserves the optional `accessLevel` permission attribute when passing authorization requests to the policy, including custom string values. Non-string values are rejected. Existing policy decisions and token restrictions are unchanged.
