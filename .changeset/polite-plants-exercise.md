---
'@backstage/plugin-catalog-backend': minor
---

Port `GithubOrgReaderProcessor` to support configuration via
[`integrations`](https://backstage.io/docs/integrations/github/locations) in
addition to [`catalog.processors.githubOrg.providers`](https://backstage.io/docs/integrations/github/org#configuration).
The `integrations` package supports authentication with both personal access
tokens and GitHub apps.

This deprecates the `catalog.processors.githubOrg.providers` configuration. If
you still have a configuration for providers the processor keeps working, but
consider moving the [`integrations` configuration](https://backstage.io/docs/integrations/github/locations)
as the providers will be removed in the future. You might need to allow
additional scopes for the credentials.

If you want to stay with providers for now, this introduces a small breaking
change, previously if you had no provider configured, one for GitHub was automatically added. To keep the behavior, add a
default provider for GitHub:

```yaml
catalog:
  processors:
    githubOrg:
      providers:
        - target: https://github.com
          apiBaseUrl: https://api.github.com
```
