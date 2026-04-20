---
'@backstage/backend-defaults': patch
---

Fixed `BitbucketServerUrlReader` to forward the per-request `token` from `UrlReaderServiceReadUrlOptions` to all Bitbucket Server API calls, matching the behavior of the GitHub and GitLab readers. Setups that rely on per-request tokens instead of a static token in the integration config will now authenticate correctly.
