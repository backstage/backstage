---
'@backstage/plugin-permission-node': patch
---

Added createConditionAuthorizer utility function, which takes some permission conditions and returns a function that returns a definitive authorization result given a decision and a resource.
