---
'@backstage/plugin-permission-react': patch
---

Adds `resourceRef: false` support to `usePermission` and `RequirePermission` to check unconditional access across all resources. Missing resource references continue to deny access unless universal checking is explicitly requested. Requires an updated permission backend.
