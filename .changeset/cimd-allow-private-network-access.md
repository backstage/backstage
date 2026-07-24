---
'@backstage/plugin-auth-backend': patch
---

Added `dangerouslyAllowPrivateNetworkAccess` option to the CIMD configuration. When enabled, CIMD metadata fetches are allowed to resolve to private network addresses (RFC 1918), which is needed for CIMD clients hosted on internal networks. The `allowedClientIdPatterns` allowlist still applies.
