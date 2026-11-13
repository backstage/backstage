---
'@backstage/plugin-bitbucket-cloud-common': patch
---

Added `BitbucketCloudClient.searchWorkspaceCode` and the `CodeSearch` types for the workspace code search API of Bitbucket Cloud (`POST /2.0/workspaces/{workspace}/codesearch`). This API needs a credential that identifies a user, with the scopes `read:repository:bitbucket` and `read:workspace:bitbucket`. Bitbucket Cloud rejects app passwords for this API.

Deprecated `BitbucketCloudClient.searchCode`, because Bitbucket Cloud removes the endpoint that it uses on 2026-11-15.
