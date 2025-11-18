---
'@backstage/plugin-scaffolder-backend-module-bitbucket-cloud': patch
'@backstage/plugin-scaffolder-backend-module-bitbucket': patch
'@backstage/plugin-bitbucket-cloud-common': patch
'@backstage/backend-defaults': patch
'@backstage/integration': patch
---

Support for Bitbucket Cloud's API token was added as `appPassword` is deprecated (no new creation from September 9, 2025) and will be removed on June 9, 2026.

API token usage example:

```yaml
integrations:
  bitbucketCloud:
    - username: user@domain.com
      token: my-token
```
