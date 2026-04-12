---
'@backstage/backend-defaults': minor
---

Added support for AWS RDS IAM authentication for PostgreSQL connections. Set `connection.type: rds` along with `host`, `user`, and `region` to use short-lived IAM tokens instead of a static password. Requires the `@aws-sdk/rds-signer` package and an IAM role with `rds-db:connect` permission.
