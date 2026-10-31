---
'@backstage/plugin-permission-common': patch
---

Adds the optional `accessLevel` permission attribute for classifying operations, such as administrative access using `admin`. Custom string values are supported; policies determine their meaning, with no automatic grants or hierarchy. Upgrade the permission backend before relying on this attribute in policies.
