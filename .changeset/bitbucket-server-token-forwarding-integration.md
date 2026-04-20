---
'@backstage/integration': patch
---

Added an optional token parameter to `getBitbucketServerRequestOptions`, `getBitbucketServerDefaultBranch`, and `getBitbucketServerDownloadUrl`. When provided, it takes priority over the token from the integration config, letting callers pass per-request credentials.
