---
'@backstage/plugin-kubernetes-backend': patch
---

Declare the existing per-cluster `assumeRole` and `externalId` options in the configuration schema so schema-generated configuration forms can expose AWS IAM role authentication settings. External IDs are marked as secrets.
