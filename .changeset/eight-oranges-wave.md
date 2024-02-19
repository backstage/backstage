---
'@backstage/plugin-auth-node': patch
---

Fix error when Microsoft tokens (or any other using the `defaultProfileTransform`) are requested without the profile scope.
