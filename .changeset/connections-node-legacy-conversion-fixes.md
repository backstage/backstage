---
'@backstage/connections-node': patch
---

Fixed several cases where valid legacy `integrations` configuration was converted into connections that failed validation at startup: `googleGcs` configuration is now read as a single object rather than a list, `github` and `azure` entries without an explicit `host` now default to `github.com` and `dev.azure.com`, and Harness entries without a `token`, which cannot be represented as a connection, are now skipped instead of producing an invalid connection. Escaped newlines in the `googleGcs` private key are restored during conversion, and errors thrown while converting legacy configuration now include context about which configuration was at fault.
