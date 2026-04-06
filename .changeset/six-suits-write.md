---
'@backstage/integration': patch
---

Fixed `SingleInstanceGithubCredentialsProvider` to return app credentials when `getCredentials` is called with a bare host URL (e.g. `https://github.com`) instead of falling back to a personal access token.
