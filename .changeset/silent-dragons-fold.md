---
'@backstage/integration': minor
---

`getGitHubFileFetchUrl` and `getGitHubRequestOptions` now require a `credentials` argument. This is needed to address an issue where the raw route was chosen by the `UrlReader` when using GitHub Apps based auth.

Deprecated the `getGitHubRequestOptions` function, which is no longer used internally.
