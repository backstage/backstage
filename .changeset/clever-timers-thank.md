---
'@backstage/backend-common': patch
'@backstage/integration': patch
---

Add support for GitHub Apps authentication for backend plugins.

`GithubCredentialsProvider` requests and caches GitHub credentials based on a repository or organization url.

The `GithubCredentialsProvider` class should be considered stateful since tokens will be cached internally.
Consecutive calls to get credentials will return the same token, tokens older than 50 minutes will be considered expired and reissued.
`GithubCredentialsProvider` will default to the configured access token if no GitHub Apps are configured.

More information on how to create and configure a GitHub App to use with backstage can be found in the documentation.

Usage:

```javascript
const credentialsProvider = new GithubCredentialsProvider(config);
const { token, headers } = await credentialsProvider.getCredentials({
  url: 'https://github.com/',
});
```

Updates `GithubUrlReader` to use the `GithubCredentialsProvider`.
