---
'@backstage/integration': patch
'@backstage/backend-defaults': patch
---

Fixed `BitbucketServerUrlReader` to forward the per-request `token` from `UrlReaderServiceReadUrlOptions` to all Bitbucket Server API calls, matching the behavior of the GitHub and GitLab readers. Added an optional token parameter to `getBitbucketServerRequestOptions`, `getBitbucketServerDefaultBranch`, and `getBitbucketServerDownloadUrl` that takes priority over the token from the integration config.
