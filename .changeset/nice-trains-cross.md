---
'@backstage/plugin-catalog': patch
---

Add permission check to unregister entity button

If the permissions framework is disabled, this change should have no effect. If the permission framework is enabled, the unregister entity button will be disabled for those who do not have access to the `catalogEntityDeletePermission` as specified in your permission policy.
