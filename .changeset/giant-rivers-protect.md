---
'@backstage/integration': patch
'@backstage/plugin-catalog-backend': minor
---

Updates the `GithubCredentialsProvider` to return the token type, it can either be `token` or `app` depending on the authentication method.

Update the `GithubOrgReaderProcessor` NOT to query for email addresses if GitHub Apps is used for authentication, this is due to inconsistencies in the GitHub API when using server to server communications and installation tokens. https://github.community/t/api-v4-unable-to-retrieve-email-resource-not-accessible-by-integration/13831/4 for more info.

**Removes** deprecated GithubOrgReaderProcessor provider configuration(`catalog.processors.githubOrg`). If you're using the deprecated config section make sure to migrate to [integrations](https://backstage.io/docs/integrations/github/locations) instead.
