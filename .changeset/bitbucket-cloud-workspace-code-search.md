---
'@backstage/plugin-bitbucket-cloud-common': patch
---

Added `BitbucketCloudClient.searchWorkspaceCode` and the `CodeSearch` types for the workspace code search API of Bitbucket Cloud (`POST /2.0/workspaces/{workspace}/codesearch`). This API needs a credential that identifies a user, with the scopes `read:repository:bitbucket` and `read:workspace:bitbucket`. Bitbucket Cloud rejects app passwords, legacy OAuth consumers, and API keys for this API with `BitbucketCloudApiError` status `403`.

Added `BitbucketCloudClient.repositorySourceFileExists`, `BitbucketCloudClient.listRepositorySource`, and `BitbucketCloudApiError` so callers can fall back to the Bitbucket Cloud source API when workspace code search is unavailable.

Deprecated `BitbucketCloudClient.searchCode`, because Bitbucket Cloud removes the endpoint that it uses on 2026-11-15.
