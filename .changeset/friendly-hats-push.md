---
'@backstage/integration-aws-node': patch
---

The `getDefaultCredentialsChain` function now accepts and applies a `region` parameter, preventing it from defaulting to `us-east-1` when no region is specified.
