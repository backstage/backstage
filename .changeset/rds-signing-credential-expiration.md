---
'@backstage/backend-defaults': patch
---

Fixed AWS RDS IAM authentication tokens being reused after their signing credentials expire, which could cause database connection failures when using temporary AWS credentials.
