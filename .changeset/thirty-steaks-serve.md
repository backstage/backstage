---
'@backstage/plugin-auth-backend-module-aws-alb-provider': patch
'@backstage/plugin-auth-backend': patch
---

Fixed a foreign key constraint violation when issuing refresh tokens for CIMD clients, and
prevented a failed refresh token issuance from failing the entire token exchange.
Fixed AWS ALB auth provider incorrectly returning HTTP 500 instead of 401 for JWT validation failures,
which caused retry loops and memory pressure under load.
