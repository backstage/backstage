---
'@backstage/integration': patch
---

Bitbucket Cloud OAuth access tokens returned by `getBitbucketCloudOAuthToken` are now cached separately for each set of OAuth client credentials. Previously a single token was cached globally, which could cause the wrong token to be used when more than one Bitbucket Cloud integration was configured or when OAuth credentials were rotated.
