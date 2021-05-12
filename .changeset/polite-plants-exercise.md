---
'@backstage/plugin-catalog-backend': minor
---

Port `GithubOrgReaderProcessor` to support configuration via
[`integrations`](https://backstage.io/docs/integrations/github/locations) in
addition to [`catalog.processors.githubOrg.providers`](https://backstage.io/docs/integrations/github/org#configuration).
The `integrations` package supports authentication with both personal access
tokens and GitHub apps.

This deprecates the `catalog.processors.githubOrg.providers` configuration.
A [`integrations` configuration](https://backstage.io/docs/integrations/github/locations)
for the same host takes precedence over the provider configuration.
You might need to add additional scopes for the credentials.
