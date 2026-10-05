---
'@backstage/backend-defaults': patch
---

Fix RDS IAM auth tokens being signed with expired AWS credentials: resolve credentials on every token mint instead of reusing a Signer cached for the pool's lifetime.
