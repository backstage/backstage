---
'@backstage/plugin-permission-react': patch
---

Permission checks made in the same tick are now batched into a single call to the permission backend.
