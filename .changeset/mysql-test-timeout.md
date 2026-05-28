---
'@backstage/backend-test-utils': patch
---

Increased MySQL connection and pool timeouts to reduce flaky `connect ETIMEDOUT` failures in CI. The test MySQL container now also uses `mysql_native_password` for cheaper connection handshakes and disables binary logging.
