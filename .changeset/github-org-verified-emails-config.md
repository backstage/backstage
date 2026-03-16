---
'@backstage/plugin-catalog-backend-module-github': patch
'@backstage/plugin-catalog-backend-module-github-org': patch
---

Added a `defaultUserTransformer.useVerifiedEmails` config option for the `githubOrg` provider. When set to `true`, the default user transformer prefers organization verified domain emails over the user's public GitHub email. Defaults to `false`, which uses only the public GitHub email.

This option has no effect when a custom user transformer is set via the `githubOrgEntityProviderTransformsExtensionPoint`.

```yaml
catalog:
  providers:
    githubOrg:
      production:
        githubUrl: https://github.com
        orgs:
          - my-org
        defaultUserTransformer:
          useVerifiedEmails: true
```
