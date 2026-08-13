---
'@backstage/connections-node': patch
---

Fixed several cases where valid legacy `integrations` configuration was converted into connections that failed validation at startup: `googleGcs` configuration is now read as a single object rather than a list, `github` and `azure` entries without an explicit `host` now default to `github.com` and `dev.azure.com`, and Harness entries without a `token`, which cannot be represented as a connection, are now skipped instead of producing an invalid connection. Escaped newlines in the `googleGcs` private key are restored during conversion, and errors thrown while converting legacy configuration now include context about which configuration was at fault.

Legacy integrations that resolve to the same connection — for example multiple `bitbucketCloud` entries, which always target `bitbucket.org` — are now merged into a single connection that combines their auth methods, instead of being rejected as duplicates at startup. Conflicting settings across merged entries keep the first entry's value with a warning. Duplicate `accountId` entries in legacy `aws.accounts` configuration now resolve to the first entry, matching the legacy lookup behavior, instead of failing validation.
