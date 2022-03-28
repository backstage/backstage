---
'@backstage/plugin-permission-backend': patch
---

- Add more specific check for policies which return conditional decisions for non-resource permissions.
- Refine permission validation in authorize endpoint to differentiate between `BasicPermission` and `ResourcePermission` instances.
