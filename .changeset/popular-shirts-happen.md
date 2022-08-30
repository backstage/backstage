---
'@backstage/plugin-permission-react': patch
---

**DEPRECATION**: The `PermissionedRoute` component has been deprecated in favor of the new `RequirePermission` component. This is because the usage pattern of `PermissionedRoute` is not compatible with React Router v6 stable.

Embed the type from `react-router` instead of exporting it directly.
