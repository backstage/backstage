---
'@backstage/plugin-permission-react': minor
---

**BREAKING**: More restrictive typing for `usePermission` hook and `PermissionedRoute` component. It's no longer possible to pass a `resourceRef` unless the permission is of type `ResourcPermission`.
